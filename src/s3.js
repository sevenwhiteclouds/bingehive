const s3Configs = require("./configs_DO_NOT_GITHUB.json").s3;
const s3 = require("aws-sdk/clients/s3");

const s3Access = new s3({
  region: s3Configs.region,
  accessKeyId: s3Configs.accessKey,
  secretAccessKey: s3Configs.secretAccessKey
});

async function s3Upload(file, name) {
  let success = true;
  const uploadParams = {
    Bucket: s3Configs.name,
    Body: file,
    Key: name
  }

  try {
    await s3Access.upload(uploadParams).promise();
  } catch (e) {
    console.log("S3 upload failed");
    success = false;
  }

  return success;
}

function s3Download(file) {
  const downloadParms = {
    Key: file,
    Bucket: s3Configs.name
  }

  return s3Access.getObject(downloadParms).createReadStream();
}

module.exports = {
  s3Upload,
  s3Download
};