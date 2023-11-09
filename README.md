
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