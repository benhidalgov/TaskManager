# 🚀 Enterprise Kanban Board

> Un gestor de tareas tipo Trello/Jira de alto rendimiento, construido con React, TypeScript y Supabase.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📸 Demo

![Kanban Demo](https://via.placeholder.com/800x400?text=Insertar+GIF+o+Captura+de+Pantalla+Aqui)
*(Puedes arrastrar tareas entre columnas, editar con doble clic y los cambios persisten en la nube)*

## 💡 Sobre el Proyecto

Esta aplicación no es solo una lista de tareas (To-Do list). Es una implementación completa de un **tablero Kanban interactivo** que resuelve problemas complejos de estado y persistencia en aplicaciones frontend modernas.

El objetivo fue crear una experiencia de usuario (UX) fluida ("snappy") utilizando patrones de **Optimistic UI**, donde la interfaz responde instantáneamente mientras sincroniza datos en segundo plano con PostgreSQL.

### ✨ Características Clave

- **Drag & Drop Fluido:** Implementado con `@hello-pangea/dnd` para una experiencia táctil y natural.
- **Persistencia en la Nube:** Base de datos PostgreSQL gestionada por Supabase.
- **Autenticación Segura:** Sistema de Login/Registro con Supabase Auth.
- **Row Level Security (RLS):** Las tareas están protegidas a nivel de base de datos; cada usuario solo puede acceder y modificar su propia información.
- **Edición Inline:** Doble clic para editar tareas al instante.
- **Optimistic Updates:** La UI se actualiza antes de recibir la confirmación del servidor para eliminar la latencia percibida.

## 🛠️ Stack Tecnológico

La arquitectura fue elegida priorizando escalabilidad y Developer Experience (DX):

| Tecnología | Rol | Justificación |
|------------|-----|---------------|
| **React + Vite** | Frontend | Velocidad de desarrollo y ecosistema maduro. |
| **TypeScript** | Lenguaje | Tipado estricto para evitar errores en tiempo de ejecución (Type Safety). |
| **Zustand** | Estado | Gestión de estado global atómica y ligera (vs el boilerplate de Redux). |
| **Supabase** | Backend-as-a-Service | Base de datos PostgreSQL real + Auth + API instantánea. |
| **TailwindCSS** | Estilos | Desarrollo rápido de UI responsiva y consistente. |

## 🚀 Instalación y Uso

1. **Clonar el repositorio**
   ```bash
   git clone [https://github.com/tu-usuario/enterprise-kanban.git](https://github.com/tu-usuario/enterprise-kanban.git)
   cd enterprise-kanban
