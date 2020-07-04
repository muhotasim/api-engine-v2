const dbSdk = require('../databaseSDK');
const modulePrefix = 'api_engine_';
module.exports = function (app, prefix) {
  app.post(prefix + '/module/create', function (req, res) {
    dbSdk.createTable(modulePrefix + req.body.moduleName, function (d) {
      res.send({
        status: 'success',
        data: [],
      });
    });
  });
  app.post(prefix + '/module/delete', function (req, res) {
    const params = req.body;

    dbSdk.selectWithQuery(
      `SELECT * FROM system WHERE name='${modulePrefix + params.moduleName}'`,
      (result) => {
        let d = result[0];
        dbSdk.deleteWithQuery('system', 'WHERE id=' + d.id, (re) => {
          dbSdk.deleteTable(modulePrefix + params.moduleName, function () {
            res.send({
              status: 'success',
              data: [],
            });
          });
        });
      }
    );
  });
  app.post(prefix + '/module/add-field', function (req, res) {
    const params = req.body;
    dbSdk.selectWithQuery(
      `SELECT * FROM system WHERE name='${modulePrefix + params.moduleName}'`,
      (result) => {
        let field = JSON.parse(params.field);
        let d = result[0];
        let structure = JSON.parse(d.structure);
        let fieldIndex = structure.findIndex((d) => {
          return d.name == field.name;
        });
        if (fieldIndex == -1) {
          structure.push(field);
          d.structure = JSON.stringify(structure);
          dbSdk.updateData(
            'system',
            d,
            ` WHERE name='${modulePrefix + params.moduleName}'`,
            () => {
              dbSdk.addField(modulePrefix + params.moduleName, field, function (
                d
              ) {
                res.send({
                  status: 'success',
                  data: [],
                });
              });
            }
          );
        } else {
          res.send({
            status: 'failed',
            data: [],
          });
        }
      }
    );
  });
  app.post(prefix + '/module/remove-field', function (req, res) {
    const params = req.body;
    dbSdk.selectWithQuery(
      `SELECT * FROM system WHERE name='${modulePrefix + params.moduleName}'`,
      (result) => {
        let field = JSON.parse(params.field);
        let d = result[0];
        let structure = JSON.parse(d.structure);
        let fieldIndex = structure.findIndex((d) => {
          return d.name == field.name;
        });
        structure.splice(fieldIndex, 1);
        d.structure = JSON.stringify(structure);
        dbSdk.updateData(
          'system',
          d,
          ` WHERE name='${modulePrefix + params.moduleName}'`,
          () => {
            dbSdk.removeField(
              modulePrefix + params.moduleName,
              JSON.parse(params.field),
              function (d) {
                res.send({
                  status: 'success',
                  data: [],
                });
              }
            );
          }
        );
      }
    );
  });
  app.post(prefix + '/modules', function (req, res) {
    const params = req.body;
    let query = ' SELECT * FROM system  LIMIT 10 OFFSET 0';
    dbSdk.selectWithQuery(query, (returnData) => {
      res.send({
        status: 'success',
        data: returnData,
      });
    });
  });
  app.get(prefix + '/:moduleName/:dataId', function (req, res) {
    const params = req.params;
    const moduleName = modulePrefix + params.moduleName;
    const dataId = params.dataId;
    let query = ` SELECT * FROM ${moduleName} WHERE id=${dataId} LIMIT 1`;
    dbSdk.selectWithQuery(query, (returnData) => {
      res.send({
        status: 'success',
        data: returnData,
      });
    });
  });
  app.post(prefix + '/:moduleName/getData', function (req, res) {
    const params = req.body;
    const moduleName = modulePrefix + req.params.moduleName;
    const query = `SELECT ${
      params.select ? params.select : '*'
    } FROM ${moduleName} ${params.query ? params.query : ''}`;
    dbSdk.selectWithQuery(query, (returnData) => {
      res.send({
        status: 'success',
        data: returnData,
      });
    });
  });
  app.post(prefix + '/:moduleName/deleteData', function (req, res) {
    const params = req.body;
    const moduleName = modulePrefix + req.params.moduleName;
    const query = `DELETE  FROM ${moduleName} ${
      params.query ? params.query : ''
    }`;
    dbSdk.selectWithQuery(query, (returnData) => {
      res.send({
        status: 'success',
        data: returnData,
      });
    });
  });

  app.post(prefix + '/:moduleName/update/:id', function (req, res) {
    const moduleName = modulePrefix + req.params.moduleName;
    console.log(req.body);
    dbSdk.updateData(
      moduleName,
      req.body,
      'WHERE id=' + req.params.id,
      (returnData) => {
        res.send({
          status: 'success',
          data: returnData,
        });
      }
    );
  });
};
