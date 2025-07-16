# Proyecto Integrador 3 - Marketplace de Servicios

Este proyecto es un marketplace de servicios desarrollado con Node.js, Prisma, y Angular.

## 🚀 Requisitos

- Node.js (v18 o superior recomendado)
- npm
- PostgreSQL o MySQL (según tu configuración de Prisma)
- Git

## ⚙️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/Gabriel-Aguilar-e/Proyecto_Integrador.git
   cd Proyecto_Integrador
   ```

2. **Instala dependencias del backend:**
   ```bash
   cd marketplace-servicios/server
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en `marketplace-servicios/server` con tu conexión a la base de datos.
   - Ejemplo:
     ```
     DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/tu_basededatos"
     ```

4. **Ejecuta las migraciones y pobla la base de datos:**
   ```bash
   npx prisma migrate deploy
   npx ts-node prisma/seed-users-providers.ts
   npx ts-node prisma/seed-provider.ts
   npx ts-node prisma/seed-availability.ts
   ```

5. **Inicia el backend:**
   ```bash
   npm run dev
   ```

6. **Instala dependencias del frontend:**
   ```bash
   cd ../client
   npm install
   ```

7. **Inicia el frontend:**
   ```bash
   npm start
   ```
   o
   ```bash
   ng serve
   ```

## 📝 Notas

- Si necesitas poblar más usuarios/proveedores, edita y ejecuta los scripts de seed en la carpeta `prisma`.
- Asegúrate de que el backend esté corriendo antes de usar el frontend.
- Si tienes problemas con la base de datos, revisa la configuración en `.env`.

## 🤝 Colaboradores

- ALVARO DORADO YEPEZ

---

¡Listo! Ahora puedes empezar a trabajar y colaborar en el proyecto.