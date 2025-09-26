```markdown
# PIC System v2

**PIC System v2** es una aplicación web desarrollada con **React + TypeScript**, orientada a la **gestión de productos** para la construcción de **cotizaciones comerciales**. Su propósito es permitir la carga masiva y actualización de catálogos de productos, facilitando la generación ágil de cotizaciones personalizadas, con control de precios, impuestos y descuentos.

---

## Características principales

- Importación de productos desde archivos CSV o Excel
- Gestión visual de productos, categorías y marcas
- Generación de cotizaciones con múltiples productos
- Cálculo automático de totales, impuestos y descuentos
- Exportación de cotizaciones en PDF o Excel (pendiente)
- Soporte para roles de administrador y vendedor (planificado)

---

## Casos de uso

1. El administrador carga un archivo CSV con productos y precios.
2. El sistema valida los datos e informa errores antes de guardar.
3. Los vendedores pueden buscar productos, agregarlos a una cotización, y modificar cantidades o aplicar descuentos.
4. El sistema calcula automáticamente los totales, con impuestos incluidos.
5. La cotización puede exportarse para ser compartida con el cliente.

---

## 🧩 Stack tecnológico

| Tecnología     | Descripción                    |
|----------------|--------------------------------|
| React          | Librería principal de UI       |
| Vite           | Bundler ultrarrápido           |
| TypeScript     | Tipado estático y seguro       |
| Tailwind CSS   | Estilos utilitarios modernos   |
| PostCSS        | Procesador CSS personalizado   |

> El proyecto está preparado para integrar librerías como:
> - [PapaParse](https://www.papaparse.com/) para importar CSV
> - [Zod](https://zod.dev/) para validación de datos
> - [React PDF](https://react-pdf.org/) o [SheetJS](https://sheetjs.com/) para exportaciones

---

## 📁 Estructura del proyecto

```

pic-system-v2/
├── public/                # Archivos estáticos
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── pages/             # Vistas principales (catálogo, cotizaciones)
│   ├── types/             # Tipos y modelos de datos
│   ├── services/          # (Opcional) Adaptadores de API
│   └── App.tsx            # Componente raíz
├── tailwind.config.js     # Configuración de Tailwind
├── vite.config.ts         # Configuración del proyecto
├── tsconfig.json          # Configuración de TypeScript
└── README.md              # Este archivo

````

---

## 🚀 Instalación y ejecución local

```bash
# 1. Clona el repositorio
git clone https://github.com/YeridStick/pic-system-v2.git
cd pic-system-v2

# 2. Instala dependencias
npm install

# 3. Ejecuta en modo desarrollo
npm run dev
````

> La app estará disponible en: [http://localhost:5173](http://localhost:5173)

---

## 📌 Estado actual

* ✅ Base del proyecto frontend inicializada
* ✅ Configuración de Tailwind, Vite y TypeScript
* ⬜ Importación de productos desde CSV (pendiente)
* ⬜ Módulo de cotizaciones (pendiente)
* ⬜ Exportación PDF/Excel (pendiente)
* ⬜ Roles y autenticación (pendiente)

---


## 🔮 Próximas funcionalidades

* Interfaz visual para cargar y validar productos
* Tabla editable con filtros y paginación
* Generador de cotizaciones con exportación
* Soporte multiusuario y control de roles
* Integración con backend RESTful o almacenamiento local (IndexedDB)

---

## Contacto

Este proyecto fue creado por **Yerid Stick Ramírez Guzmán** como una solución para optimizar la carga y gestión de productos en procesos de cotización.
