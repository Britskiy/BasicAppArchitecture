const DynamicConfig = require("dynamic-config");
const dynamicConfig = new DynamicConfig({
    defaultEnv: "develop",
    log: console.log
});
export = dynamicConfig.load(__dirname, "config");