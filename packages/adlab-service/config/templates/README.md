## Container Configuration Parameters

These are the configuration values that you can be set on the configuration server.
Your service's configuration file will be generated with these values on container startup.

The service-docker.json file here is a template using handlebars {{...}} to represent configurable parmaters. If you view the file, you'll see an handlebar representation for the WORKER_COUNT parameter. The value will get populated by a value from a configuration server. For testing purposes, you can also set the value in the static node-template-service/config/config.yml file if you do not have a configuration server running.

### node-service-template parameters

| Config Name  | Mandatory | Default |
| ------------ | --------- | ------- |
| WORKER_COUNT | No        | -1      |

### Organization on config server

Configuration values are grouped in the configuration server based on the following parameters:

- business_unit: aiva
- git_org: platform
- repository: node-service-template
- environment: prod/staging/dev/psr/qa/stable/local

For example, _WORKER_COUNT_ would be stored in the config server under lookup key (note the repository name is normalized with the dash removed)::
_"aiva-platform-nodeservicetemplate-\<env\>"_

and value:
_"\<env\>.WORKER_COUNT"_
