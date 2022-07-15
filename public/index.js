//selecting quaries

const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#file-input");
const browseBtn = document.querySelector(".browseBtn");
const centerImg = document.querySelector(".center");

const bgProgress = document.querySelector(".bg-progress");
const percent = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");

const progressContainer = document.querySelector(".progress-container");

const uploadStatus = document.querySelector(".title");

const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");
const reloadBtn = document.querySelector(".reload");

const toast = document.querySelector(".toast");

//addresses
const host = "https://easefiles.herokuapp.com/";
const uploadURL = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb

//Events
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave", (e) => {
  if (dropZone.classList.contains("dragged")) {
    dropZone.classList.remove("dragged");
  }
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");

  console.log(e.dataTransfer.files.length);
  const files = e.dataTransfer.files;

  //if dropped files are more than one
  //show toast error
  //share it with fileInput
  if (files.length === 1) {
    if (files[0].size < maxAllowedSize) {
      fileInput.files = files;
      uploadFile();
    } else {
      showToast("Max file size is 100MB");
    }
  } else if (files.length > 1) {
    showToast("You can't upload multiple files");
  }
});

//transfer click on browserbtn to fileinput
browseBtn.addEventListener("click", () => {
  fileInput.click();
});

//if manually added upload the file
fileInput.addEventListener("change", () => {
  if (fileInput.files[0].size > maxAllowedSize) {
    showToast("Max file size is 100MB");
    fileInput.value = ""; // reset the input
    return;
  }
  uploadFile();
});

const uploadFile = () => {
  const files = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", files);

  //show the uploader
  progressContainer.style.display = "block";

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    console.log(xhr.readyState);
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      showLink(JSON.parse(xhr.response));
    }
  };

  // handle error
  xhr.upload.onerror = function () {
    showToast(`Error in upload: ${xhr.status}.`);
    fileInput.value = ""; // reset the input
  };

  xhr.upload.onprogress = updateProgress;

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

fileURL.addEventListener("click", () => {
  fileURL.select();
});

//updates the progress bar and percentage values
const updateProgress = (e) => {
  let percentage = Math.round((100 * e.loaded) / e.total);

  percent.innerText = percentage;
  const scaleX = `scaleX(${percentage / 100})`;
  bgProgress.style.transform = scaleX;
  progressBar.style.transform = scaleX;

  console.log(e);
};

//when file is uploaded show the download link
const showLink = ({ file }) => {
  fileInput.value = ""; // reset the input
  uploadStatus.innerText = "File Uploaded";

  //Do follwing changes as soon as link arrives
  //remove the disabled attribute from form btn & make text send
  emailForm[2].removeAttribute("disabled");
  emailForm[2].innerText = "Send";
  progressContainer.style.display = "none";
  dropZone.style.borderColor = "#f37368ff";
  centerImg.src = "./assets/file-center-completed.svg";

  console.log(file);
  sharingContainer.style.display = "block";
  reloadBtn.style.display = "block";
  fileURL.value = file;
};

//copy link on click
copyURLBtn.addEventListener("click", (e) => {
  fileURL.select();
  navigator.clipboard.writeText(fileURL.value);
  showToast("Copied to clipboard");
});

emailForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop submission

  // disable the button
  emailForm[2].setAttribute("disabled", "true");
  emailForm[2].innerText = "Sending";

  const url = fileURL.value;

  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };
  console.log(formData);

  //req to send mail
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showToast("Email Sent");
        sharingContainer.style.display = "none"; // hide the box
      }
    });
});

let toastTimer;

// the toast function
const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.innerText = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
};
