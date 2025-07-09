# Cliente Requst

Requst Client es una herramienta web potente e intuitiva que le permite enviar solicitudes de API, ver respuestas, gestionar el historial de solicitudes y guardarlas como colecciones. Diseñado de forma similar a Postman o Insomnia, ayuda a los desarrolladores a probar y depurar APIs de manera eficiente.

## Características

### 1. Gestión de Solicitudes y Respuestas
- **Creación de Solicitudes**: Cree solicitudes de API seleccionando un método HTTP (GET, POST, PUT, DELETE, etc.) e introduciendo la URL de la solicitud.
- **Cuerpo de la Solicitud**: Admite cuerpos de solicitud en formato JSON, con una práctica función de formato JSON.
- **Gestión de Encabezados**: Añada, edite, habilite/deshabilite encabezados de solicitud como pares clave-valor.
- **Autenticación**: Admite la autenticación con Bearer Token.
- **Parámetros de Consulta**: Gestione y habilite/deshabilite fácilmente los parámetros de consulta como pares clave-valor.
- **Encabezados Globales**: Configure y gestione encabezados globales que se aplican automáticamente a todas las solicitudes.
- **Visualización de Respuestas**: Muestra claramente el código de estado de la respuesta, el texto de estado, el tiempo de respuesta, los encabezados y el cuerpo de sus solicitudes. El cuerpo de la respuesta se convierte automáticamente a formato JSON para una mejor legibilidad.

### 2. Gestión y Organización de Datos
- **Colecciones**: Guarde y gestione las solicitudes de uso frecuente como colecciones.
- **Agrupación**: Organice las solicitudes sistemáticamente agrupándolas dentro de colecciones.
- **Arrastrar y Soltar**: Reordene fácilmente las solicitudes y grupos dentro de las colecciones usando arrastrar y soltar.
- **Filtrado**: Busque rápidamente solicitudes en colecciones e historial por nombre o URL.
- **Historial**: Guarda automáticamente un registro de todas las solicitudes enviadas, permitiéndole recargar fácilmente solicitudes anteriores o guardarlas en colecciones.
- **Exportación/Importación de Datos**: Exporte o importe todo su historial de solicitudes, colecciones, encabezados globales y configuraciones de interfaz de usuario como un archivo JSON, facilitando la copia de seguridad y restauración de sus datos.

### 3. Interfaz de Usuario y Configuración
- **Interfaz de Usuario Intuitiva**: Proporciona una interfaz limpia y fácil de usar para agilizar el proceso de prueba de API.
- **Temas**: Personalice su experiencia de usuario eligiendo entre varios temas de interfaz de usuario.

## Uso

### 1. Configuración y Ejecución del Proyecto

Para ejecutar el proyecto en su entorno local, siga estos pasos:

```bash
# 1. Clone el repositorio
git clone https://github.com/your-username/requst-client.git
cd requst-client

# 2. Instale las dependencias
npm install

# 3. Ejecute la aplicación
npm start
```

La aplicación se ejecutará en `http://localhost:3000` (o en otro puerto disponible).

### 2. Envío de Solicitudes de API

1.  **Introduzca la URL y el Método**: En el panel "Solicitud", introduzca la URL de la API que desea solicitar y seleccione el método HTTP (GET, POST, etc.) del menú desplegable.
2.  **Configure los Detalles de la Solicitud**:
    *   **Cuerpo**: Para solicitudes POST, PUT, introduzca el cuerpo de la solicitud en formato JSON en la pestaña "Cuerpo". Haga clic en el botón "Formatear JSON" para formatear el cuerpo y mejorar la legibilidad.
    *   **Encabezados**: En la pestaña "Encabezados", añada los encabezados de solicitud necesarios como pares clave-valor.
    *   **Autenticación**: En la pestaña "Autenticación", introduzca el Bearer Token.
    *   **Consulta**: En la pestaña "Consulta", añada los parámetros de consulta de la URL como pares clave-valor.
    *   **Encabezados Globales**: En la pestaña "Encabezados Globales", configure los encabezados globales que se aplicarán a todas las solicitudes.
3.  **Enviar Solicitud**: Haga clic en el botón "Enviar" para enviar la solicitud de API.
4.  **Ver Respuesta**: Verifique la respuesta (estado, tiempo, encabezados, cuerpo) de su solicitud en el panel "Respuesta".

### 3. Gestión de Colecciones e Historial

-   **Colecciones**: En la pestaña "Colecciones", puede guardar nuevas solicitudes, o editar, eliminar y agrupar las existentes. Puede reordenarlas usando arrastrar y soltar.
-   **Historial**: En la pestaña "Historial", vea una lista de solicitudes enviadas anteriormente, haga clic para recargarlas en el panel de solicitudes o guárdelas en colecciones.

### 4. Cambio de Configuración

-   Haga clic en el icono de engranaje en la parte superior de la aplicación para abrir el modal de "Configuración".
-   **Temas**: Seleccione el tema de interfaz de usuario deseado en el menú desplegable "Seleccionar Tema".
-   **Gestión de Datos**: En la sección "Gestión de Datos", haga clic en "Exportar Datos" para hacer una copia de seguridad de todos sus datos, o en "Importar Datos" para restaurar datos previamente respaldados.

---