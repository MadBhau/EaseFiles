const router = require("express").Router();
const File = require("../modules/file");

router.get("/:uuid", async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });

  //link has expired
  if (!file) {
    return res.render("download", { error: "Link has been expired." });
  }

  const response = await file.save();
  const filePath = `${__dirname}/../${file.path}`;

  res.download(filePath);
});

module.exports = router;
