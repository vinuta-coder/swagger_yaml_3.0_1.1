
function submit() {
    let s = document.getElementById("json_data").value;
    let path = document.getElementById("path").value;
    let tag = document.getElementById("tag").value;
    let model = document.getElementById("model").value;
    let type = document.getElementById("type").value;

    if (!validateForm(s, path, tag, model, type)) {
        document.getElementById('yaml_out').value = 'Please Fill All Required Field';

    } else {
        try {
            document.getElementById('yaml_out').value = '';
            let json_object = JSON.parse(s);
            writeHead(path, tag, model, type);
            parse(json_object, '    ');
        } catch (e) {
            document.getElementById('yaml_out').value = e;
        }
    }
}

function isEmpty(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function parse(s, indent) {

    if (Array.isArray(s)) {
        write(indent + 'type: \"array\"');
        write(indent + 'items:');
        if (s.length !== 0) {
            parse(s[0], indent + '  ');
        } else {
            write(indent + '  type: \"object\"');
        }
    } else if (typeof s === 'object') {
        write(indent + 'type: \"object\"');
        if (isEmpty(s)) {
            return;
        }
        write(indent + 'properties:');
        for (let key in s) {
            write(indent + '  ' + key + ':');
            if (s.hasOwnProperty(key)) {
                parse(s[key], indent + '    ');
            }
        }
    } else {
        write(indent + 'type: \"' + (typeof s) + '\"');
    }
}

function write(s) {
    // console.log(s);
    document.getElementById('yaml_out').value += s + "\n";
}

function writeHead(path, tag, model, type) {


    var header = `swagger: '2.0'
info:
  version: 1.0.0
  title: Swagger Api
host: 10.0.0.69:8080
basePath: /OM
tags:
  - name: `+ tag + `
schemes:
  - https
  - http
paths:
  /`+ path + `:
    `+ type + `:
      tags:
        - `+ tag + `
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: body
          name: body
          required: true
          schema:
            $ref: '#/definitions/`+ model + `'
      responses:
        '405':
          description: Invalid input
definitions:
  `+ model + `:`;

    write(header);

}

function validateForm(json, path, tag, model, type) {
    if (json == null || json == "" || path == null || path == "" || tag == null || tag == "" || model == null || model == "" || type == null || type == "") {

        return false;
    }
    return true;
}
