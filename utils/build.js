/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.env.ASSET_PATH = "/";

const webpack = require("webpack"),
  path = require("path"),
  fs = require("fs"),
  config = require("../webpack.config"),
  ZipPlugin = require("zip-webpack-plugin");

delete config.chromeExtensionBoilerplate;

config.mode = "production";

const packageInfo = JSON.parse(fs.readFileSync("package.json", "utf-8"));

config.plugins = (config.plugins || []).concat(
  new ZipPlugin({
    filename: `${packageInfo.name}-${packageInfo.version}.zip`,
    path: path.join(__dirname, "../", "zip"),
  }),
);

try {
  webpack(config, function (err, stats) {
    if (err) {
      console.error(err);
      process.exit(1); // Exit the process with an error code
    } else {
      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error("Build has errors:");
        info.errors.forEach((error) => {
          console.error(error);
        });
        process.exit(1); // Exit the process with an error code
      } else {
        console.log("Build completed successfully!");
      }
    }
  });
} catch (err) {
  console.error("An unexpected error occurred:", err);
  process.exit(1); // Exit the process with an error code
}
