#node-webservice
Esto es un webservice REST, que esta hecho en node y express

Solo ejecuta los siguientes pasos para lanzar la aplicación:

```
git clone git@github.com:gpcweb/node-webservice.git
cd /path/to/node-webservice
psql -f users.sql
npm install
npm start
```

Para probar la aplicación prueba los siguientes comandos desde curl:

```
curl -v localhost:3000/users
curl -v -F "username=usuario1" -F "image=@/path/to/project/node-webservice/blonde.jpg"  localhost:3000/users
```
