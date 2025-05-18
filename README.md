# simple-vue-ioc

Un microcontenedor de inversión de control (IoC) para Vue 3, diseñado para ser sencillo, flexible y sin dependencias externas.

## ¿Qué es esto?

Este paquete te permite registrar dependencias (servicios, utilidades, etc.) y luego inyectarlas fácilmente en tus componentes de Vue usando la API de `provide/inject`.

Ideal para separar responsabilidades, escribir código más limpio y desacoplado.

---

## Instalación

```bash
npm install simple-vue-ioc@latest

```

## Uso
Se debe llamar a la función createIoC y pasar un array de objetos con las propieades: "identifier" y "factory" donde "identifier" es un string con el que se identificará a la dependencia y "factory" una función que debe devolver la dependencia. La funcion "factory" recibe la instancia de IoC y permite injectar dependencias registradas en el contendor para otras dependencias.

```js
import { createApp } from "vue";
import App from "./App.vue";

import { createIoC } from "simple-vue-ioc";
import { Logger } from "./logger";
import { UserService } from "./userService";

const iocPlugin = createIoC([
  {
    identifier: "userService",
    factory: (ioc) => new UserService(ioc.inject("logger")),
  },
  {
    identifier: "logger",
    factory: () => new Logger(),
  },
]);

createApp(App).use(iocPlugin).mount("#app");

//-----------------------------//
//----- En algun componente ---//
//-----------------------------//
<script setup>
import { UserService } from "./userService";

const userService = inject("userService");
</script>
```
