#!/bin/bash

# download the latest swagger definition file
curl -fsS -o swagger.json http://localhost:5200/swagger/v1/swagger.json
# remove the existing api folder
npx rimraf projects/api/src/lib
# generate the api client
npx openapi-generator-cli generate --generator-key=fs-erp-api
# delete the swagger definition file
rm ./swagger.json

#java -jar "C:\Users\flolu\Documents\Workspace\iwi-website\backrooms\node_modules\@openapitools\openapi-generator-cli\versions\7.4.0.jar" generate --input-spec="file:///C:/Users/flolu/Documents/Workspace/iwi-website/backroomsswagger.json" --generator-name="typescript-angular" --output="projects/api/src/lib" --additional-properties="apiModulePrefix=FS-ERP,withInterfaces=true,fileNaming=kebab-case,useSingleRequestParameter=true,supportsES6=true,stringEnums=true"
