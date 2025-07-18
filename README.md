# Proyecto Integrador 3 - Marketplace de Servicios

Este proyecto es un marketplace de servicios desarrollado con **Node.js (Express, MongoDB)** para el backend y **Angular** para el frontend.

---

## 🚀 Requisitos

- Node.js (v18 o superior recomendado)
- npm
- MongoDB (Atlas o local)
- Git

---

## ⚙️ Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/PoisonGold333/marketplace-servicios.git
cd marketplace-servicios
```

### 2. Configura las variables de entorno

Copia el archivo `.env.example` como `.env` en la carpeta `server` y edítalo con tus datos de MongoDB y correo (si usas recuperación por email):

```bash
cd server
# Edita el archivo .env con tus datos reales
```

Ejemplo de `.env`:

```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/tu_basededatos
PORT=5000
CLIENT_URL=http://localhost:4200
JWT_SECRET=tu_clave_secreta_segura
```

---

### 3. Instala dependencias del backend

```bash
npm install
```

---

### 4. Inicia el backend

```bash
npm run dev
```

El backend corre en [http://localhost:5000](http://localhost:5000)

---

### 5. Instala dependencias del frontend

```bash
cd ../client
npm install
```

---

### 6. Inicia el frontend

```bash
npm start
```
o
```bash
ng serve
```

El frontend corre en [http://localhost:4200](http://localhost:4200)

---

## 📝 Notas

- El flujo de recuperación de contraseña es **directo**: el usuario ingresa su correo y nueva contraseña, y se actualiza sin envío de email.
- Si necesitas poblar la base de datos, puedes hacerlo manualmente o crear scripts según tus necesidades.
- Asegúrate de que el backend esté corriendo antes de usar el frontend.

---

## 🤝 Colaboradores

- ALVARO DORADO YEPEZ

---

¡Listo! Ahora puedes trabajar y colaborar en el proyecto.