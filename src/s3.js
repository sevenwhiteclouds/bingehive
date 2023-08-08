const s3Configs = require("./configs_DO_NOT_GITHUB.json").s3;
const s3 = require("aws-sdk/clients/s3");

const s3Access = new s3({
  region: s3Configs.region,
  accessKeyId: s3Configs.accessKey,
  secretAccessKey: s3Configs.secretAccessKey
});

async function s3Upload(file) {
  let name = crypto.randomUUID()

  const uploadParams = {
    Bucket: s3Configs.name,
    Body: file,
    Key: name
  }

  let uploadStatus;

  try {
    uploadStatus = await s3Access.upload(uploadParams).promise();
  } catch (e) {
    console.log("From s3.js: file upload failed!");
  }

  return uploadStatus;
}

function s3Download(fileKey) {
  const downloadParms = {
    Key: fileKey,
    Bucket: s3Configs.name
  }

  return s3Access.getObject(downloadParms).createReadStream();
}

module.exports = {
  s3Upload,
  s3Download
};