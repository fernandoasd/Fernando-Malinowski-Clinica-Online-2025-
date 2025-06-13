import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  nombre = 'Fernando Malinowski';
  // edad = 20;
  carrera = 'Tecnicatura Universitaria en Programación';
  juegoNombre = 'Mi juego';
  juegoDescripcion = "Fugiat eu ex id dolor fugiat sint labore laboris cillum aliquip.";
  imagenUrl = '';
  // imagenUrl = 'https://media.istockphoto.com/id/1495088043/es/vector/icono-de-perfil-de-usuario-avatar-o-icono-de-persona-foto-de-perfil-s%C3%ADmbolo-de-retrato.jpg?s=612x612&w=0&k=20&c=mY3gnj2lU7khgLhV6dQBNqomEGj3ayWH-xtpYuCXrzk='; // Asegúrate de poner tu imagen en esa ruta
}
