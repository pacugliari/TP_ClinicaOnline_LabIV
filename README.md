
# PAC - Clinica

El presente documento, es el **Trabajo Práctico FINAL** de **Tecnicatura Universitaria en Programación - Materia: Laboratorio IV - 2do Cuatrimestre 2023**. Esta es una solución informática que tiene como objetivo lograr una aplicación para la gestión de información de una Clinica Online, enfocada en la experiencia de usuario.
La misma para su desarrollo,se ha utilizado Angular y Firebase.

## Alumno
- Pablo Alberto Cugliari

## Link de la Web

[https://pac-clinica.web.app/bienvenida](https://pac-clinica.web.app/bienvenida)

## Descripcion de la Clinica

“La clínica OnLine, especialista en salud, cuenta actualmente con consultorios (6 en la actualidad),
dos laboratorios (físicos en la clínica), y una sala de espera general. Está abierta al público de lunes a
viernes en el horario de 8:00 a 19:00, y los sábados en el horario de 8:00 a 14:00.
Trabajan en ella profesionales de diversas especialidades, que ocupan los consultorios acorde a su
disponibilidad, y reciben en ellos pacientes con turno para consulta o tratamiento. Dichos turnos son
pedidos por la web seleccionando el profesional o la especialidad. La duración mínima de un turno es
30 minutos.” pero los profesionales pueden cambiar la duración según su especialidad. Estos
profesionales pueden tener más de una especialidad.
También contamos con un sector dentro de la clínica que se encarga de la organización y
administración de la misma.

## Los perfiles de usuarios son:

- Administrador
- Especialista
- Pacientes


## Pagina de Bienvenida
Pagina inicial que tiene los accesos al login y al registro del sistema

[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/paginaBienvenida1.png?raw=true" />]()

## Login
Permite ingresar al sistema teniendo un usuario y contraseña creados previamente en la seccion de registro, tambien cuenta
con botones de acceso rapido (3 pacientes,2 especialista,1 administrador).<br>
Los usuarios especialistas solo podran acceder al sistema si verificaron su email y su cuenta fue aprobada por un administrador<br>
Los usuarios pacientes solo podran acceder al sistema si verificaron su email <br>

[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/login.png?raw=true" />]()

## Registro
Podemos registrarnos como Pacientes o Especialistas

[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/registro.png?raw=true" />]()

## Registro Especialista
[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/registroEspecialista.png?raw=true" />]()

## Registro Paciente
[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/registroPaciente.png?raw=true" />]()

## Mi Perfil
Cuenta con los datos del usuario, Nombre,Apellido,Imagenes,etc.

[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/miPerfilAdministrador.png?raw=true" />]()

## Mis horarios (Especialista)
Solo presente para el especialista,en esta seccion podra marcar su disponibilidad horaria.

[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/miPerfilEspecialista.png?raw=true" />]()

## Seccion usuarios (Administrador)
Solo presente para el administrador,donde podra consultar la informacion de todos los usuarios registrados del sistema y habilitar/inhabilitar
los usuarios especialistas.<br>
Tambien tiene la posibilidad de generar nuevos usuarios (Pacientes,Especialistas,Administradores)


[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/seccionUsuarios1.png?raw=true" />]()

[<img src="https://github.com/pacugliari/TP_ClinicaOnline_LabIV/blob/main/imagenesGitHub/seccionUsuarios2.png?raw=true" />]()

## Mis turnos (Paciente y Especialista)
En la sección "Mis Turnos", los pacientes pueden gestionar fácilmente sus citas médicas, filtrando según especialidad y especialista sin la necesidad de utilizar ComboBox. Pueden cancelar turnos no realizados con un comentario explicativo, ver reseñas asociadas a los turnos y completar encuestas de satisfacción. La visibilidad de las acciones se ajusta según el estado del turno. Por otro lado, los especialistas acceden a sus turnos asignados con opciones para cancelar (si no han sido aceptados, realizados o rechazados), rechazar, aceptar y finalizar turnos. Para estos últimos, es crucial dejar reseñas detalladas sobre la consulta y diagnóstico. La visión del estado del turno es clara, mostrando acciones específicas según el estado actual.


[<img src="https://firebasestorage.googleapis.com/v0/b/pac-clinica.appspot.com/o/assets%2Fgithub%2FmisTurnos.png?alt=media&token=bd82036b-1d45-48a9-a2dd-8c5a025cd646" />]()

## Solicitud de turno (Paciente y Administradores)
En la sección de solicitud de turno, tanto pacientes como administradores tienen acceso para cargar nuevos turnos. Al solicitar un turno, se deben seleccionar la especialidad, el especialista y el día y horario deseados, con la restricción de que los pacientes pueden elegir dentro de los próximos 15 días. Estas fechas están directamente vinculadas al especialista seleccionado y su disponibilidad horaria, sin el uso de Datepicker para simplificar la experiencia. En el caso del administrador, se requiere además que marque al paciente correspondiente al turno solicitado. Esta sección facilita la programación eficiente de citas, asegurando la coherencia entre la especialidad, el especialista y la disponibilidad temporal.

[<img src="https://firebasestorage.googleapis.com/v0/b/pac-clinica.appspot.com/o/assets%2Fgithub%2FsolicitarTurno.gif?alt=media&token=813b8d55-780b-4ef4-b293-2c6ab82b4c0f" width="1556" />]()



## Filtro mis turnos
En la sección "Mis Turnos", se ha mejorado el filtro para especialistas, pacientes y administradores, permitiendo la búsqueda por cualquier campo, incluyendo la historia clínica para especialistas y pacientes. Sin embargo, para los administradores, la búsqueda no incluye la historia clínica. Esta mejora brinda una experiencia más eficiente y personalizable en la gestión de la información de los turnos, adaptándose a las necesidades específicas de cada tipo de usuario.

[<img src="https://firebasestorage.googleapis.com/v0/b/pac-clinica.appspot.com/o/assets%2Fgithub%2FfiltrosMisTurnos.png?alt=media&token=e1638b1f-92e4-4029-8c1c-44b7e29faff1" />]()



## Historia Clinica
Se ha implementado una historia clínica para cada paciente, visible desde "Mi Perfil" para pacientes, "Sección Usuarios" para administradores y "Sección Pacientes" para especialistas. La carga de la historia clínica la realiza el especialista al finalizar la atención, incluyendo cuatro datos fijos (altura, peso, temperatura, presión) y hasta tres datos dinámicos con clave y valor.


[<img src="https://firebasestorage.googleapis.com/v0/b/pac-clinica.appspot.com/o/assets%2Fgithub%2FhistoriaClinica.png?alt=media&token=ecb4d8eb-bfdd-4363-ab4d-21792484b85c" />]()

## Estadisticas (Administradores)
Se ha implementado la función de estadísticas y gráficos para los usuarios administradores en nuestro sistema. Los informes disponibles incluyen el registro de ingresos al sistema, la cantidad de turnos por especialidad, la cantidad de turnos por día, la cantidad de turnos solicitados y finalizados por médico en un lapso de tiempo. Estos informes se pueden descargar en formatos Excel o PDF para facilitar su uso y distribución.

[<img src="https://firebasestorage.googleapis.com/v0/b/pac-clinica.appspot.com/o/assets%2Fgithub%2FestadisticasUno.png?alt=media&token=dd3ccf56-48bd-4214-b9bc-7db06f47dc41" />]()

[<img src="https://firebasestorage.googleapis.com/v0/b/pac-clinica.appspot.com/o/assets%2Fgithub%2FestadisticasDos.png?alt=media&token=841b766f-b7ca-4709-81f2-d7cf36ef4cdc" />]()