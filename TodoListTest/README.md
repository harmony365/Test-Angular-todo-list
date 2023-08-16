# TodoListApp

ESTE PROYECTO FUE GENERADO CON [Angular CLI](https://github.com/angular/angular-cli) version 15.0.4.

# Install

CAMBIARSE AL DIRECTORIO DEL PROYECTO DONDE SE ENCUENTRA EL ARCHIVO package.json Y EJECUTAR EL SIGUIENTE COMANDO.

Run `npm install` PARA INSTALAR TODAS LAS DEPENDENCIAS DEL PROYECTO.

## json-server

Run `json-server --watch db.json`

Ahora ya podemos abrir http://localhost:3000/todo/1 y nos devuelve:

{"userId": 6,"id": 1,"task": "Sample Task One","status": false}

Podemos obtener un registro por su ID por ejemplo http://localhost:3000/user/6.

Las operaciones POST, PUT, PATCH y DELETE modifican el fichero db.json (usando lowdb).

Para probar el resto de operaciones se recomienda Postman para Chrome.


## Development server

Run `ng serve` PARA dev server. NATIVO EN `http://localhost:4200/`. LA APLICACION SE RECARGA AUTOMATICAMENTE SI SE CAMBIA ALGUNOS DE LOS ARCHIVOS DEL APP.

## Build

Run `ng build` PARA COMPILAR EL PROYECTO. EL PROYECTO COMPILADO QUEDARA ALMAENADO EN EL DIRECTORIO `dist/`.

## Running unit tests

Run `ng test` PARA EJECUTAR UN TEST EN [jest]

Run 'jest' 

Run 'jest --watch'

Run 'jest --coverage'
