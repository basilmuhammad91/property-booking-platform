# Property Booking Platform

<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
  </a>
</p>

<p align="center">
  <a href="https://github.com/laravel/framework/actions">
    <img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status">
  </a>
  <a href="https://packagist.org/packages/laravel/framework">
    <img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads">
  </a>
  <a href="https://packagist.org/packages/laravel/framework">
    <img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version">
  </a>
  <a href="https://packagist.org/packages/laravel/framework">
    <img src="https://img.shields.io/packagist/l/laravel/framework" alt="License">
  </a>
</p>

## About This Project

A modern property booking platform built with Laravel 11, React, and Inertia.js. This application provides a comprehensive solution for managing property listings and bookings with separate interfaces for administrators and guests.

### Features

- **Admin Dashboard**: Complete property management system
- **Guest Interface**: Browse and book properties
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons
- **File Management**: Image upload and storage for properties
- **Real-time Updates**: Powered by Inertia.js for seamless interactions
- **Responsive Design**: Mobile-first approach

### Tech Stack

- **Backend**: Laravel 11 with PHP 8.2+
- **Frontend**: React 18 with Inertia.js
- **Styling**: Tailwind CSS
- **Database**: MySQL/PostgreSQL
- **File Storage**: Laravel Storage with public disk
- **Icons**: Lucide React

## Quick Start

Follow these steps to get your local development environment up and running:

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL or PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/basilmuhammad91/property-booking-platform.git
cd property-booking-platform
```

2. **Install PHP dependencies**

```bash
composer install
```

3. **Install Node.js dependencies**

```bash
npm install
```

4. **Environment setup**

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=property_booking
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. **Generate application key**

```bash
php artisan key:generate
```

6. **Create storage link**

```bash
php artisan storage:link
```

7. **Run database migrations and seeders**

```bash
php artisan migrate --seed
```

8. **Start the development servers**

In one terminal, start the Laravel server:
```bash
php artisan serve
```

In another terminal, start the Vite development server:
```bash
npm run dev
```

## Default Credentials

After running the seeders, you can login with:

- **Admin**: admin@example.com / password
- **User**: user@example.com / password

## Development

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
php artisan test
```

### Code Style

```bash
# PHP CS Fixer
./vendor/bin/pint

# ESLint for JavaScript
npm run lint
```

## Project Structure

```
├── app/
│   ├── Http/Controllers/     # Laravel controllers
│   ├── Models/              # Eloquent models
│   └── Services/            # Business logic services
├── resources/
│   ├── js/                  # React components and pages
│   ├── css/                 # Stylesheets
│   └── views/               # Blade templates
├── routes/
│   ├── web.php             # Web routes
│   └── api.php             # API routes
└── database/
    ├── migrations/         # Database migrations
    ├── factories/          # Model factories
    └── seeders/           # Database seeders
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

If you discover any security vulnerabilities or have questions, please contact the maintainer at [basilmuhammad91@gmail.com].

---

Built with ❤️ using Laravel and React
