# SkillSwap - Skill Exchange Platform

A Laravel-based skill exchange platform where users can offer their expertise and request help from others, facilitating peer-to-peer learning and professional development.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login using Laravel Sanctum
- **Skill Posts**: Users can create posts to offer skills or request help
- **Connection System**: Send, accept, or reject connection requests between users
- **Smart Restrictions**: 24-hour cooldown period after rejection to prevent spam
- **Profile Management**: Comprehensive user profiles with social links
- **Advanced Search**: Filter posts by skill, type, level, and location

### Friendly Design
- **Clean API**: RESTful design with consistent JSON responses
- **Professional Architecture**: Laravel best practices with Resources, Form Requests, and Policies

## Tech Stack

- **Backend**: Laravel 11 with PHP 8.2+
- **Authentication**: Laravel Sanctum (API tokens)
- **Database**: PostgreSQL
- **API**: RESTful JSON API
- **Architecture**: MVC with Repository pattern

## Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- PostgreSQL
- Node.js (for asset compilation)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillswap
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database configuration**
   Update your `.env` file with database credentials:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=skillswap
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_SSLMODE=prefer
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Seed database (optional)**
   ```bash
   php artisan db:seed
   ```

7. **Start the server**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000/api`

## API Documentation

### Public Endpoints (No Authentication Required)

#### Authentication
- `POST /api/signup` - Register a new user
- `POST /api/login` - User login

#### Posts (Browse)
- `GET /api/posts` - Get all active posts with filters
- `GET /api/posts/search?q={term}` - Search posts
- `GET /api/posts/{id}` - Get single post details

#### Users (Browse)
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/{id}` - Get user profile

### Protected Endpoints (Authentication Required)

#### User Management
- `GET /api/user` - Get current user profile
- `PUT /api/users/{id}` - Update user profile
- `DELETE /api/users/{id}` - Delete user account
- `POST /api/logout` - Logout user

#### Posts Management
- `GET /api/user/posts` - Get current user's posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post

#### Connections
- `POST /api/posts/{id}/connections` - Send connection request
- `GET /api/connections/pending` - Get pending requests
- `GET /api/connections/accepted` - Get accepted connections
- `GET /api/connections` - Get all user connections
- `POST /api/connections/{id}/accept` - Accept request
- `POST /api/connections/{id}/reject` - Reject request (adds 24hr restriction)
- `DELETE /api/connections/{id}/cancel` - Cancel sent request

### Request/Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": { ... }
}
```

### Filter Parameters

#### Posts Filtering
- `type` - Filter by 'offer' or 'request'
- `level` - Filter by 'beginner', 'intermediate', or 'advanced' 
- `skill` - Search by skill name
- `location` - Filter by user location
- `exclude_own` - Exclude current user's posts (authenticated only)
- `sort` - Sort by 'created_at', 'title', 'skill', 'level', or 'type'
- `direction` - Sort direction 'asc' or 'desc'
- `per_page` - Number of results per page (default: 12)

## Database Schema

### Users Table
- Authentication fields (name, email, password)
- Profile information (bio, location, skills)
- Social links (LinkedIn, GitHub)
- Contact information (phone, shown only to connected users)

### Posts Table
- Basic information (title, description, skill)
- Type: 'offer' or 'request'
- Level: 'beginner', 'intermediate', or 'advanced'
- Status: active/inactive toggle

### Connections Table
- Links users through skill posts
- Status: 'pending', 'accepted'
- Tracks sender, receiver, and associated post

### Connection Restrictions Table
- Implements 24-hour cooldown after rejection
- Prevents spam requests to the same post

## Key Features Explained

### Connection System
1. User A sends connection request on User B's post
2. User B can accept (allows email/phone sharing) or reject
3. Rejection creates 24-hour restriction preventing new requests
4. Accepted connections enable private contact information sharing

### Privacy Controls
- Email and phone numbers only visible after connection acceptance
- Public profiles show skills, bio, and social links
- Users can only edit/delete their own content

### Smart Filtering
- Real-time search across post titles, skills, and descriptions
- Multiple filter combinations supported
- Responsive pagination for large datasets

## Architecture Highlights

### Laravel Best Practices
- **Form Requests**: Validation logic separated from controllers
- **API Resources**: Consistent data transformation and privacy controls
- **Authorization**: Policy-based access control
- **Exception Handling**: Graceful error responses with helpful messages

### Security Features
- **Sanctum Authentication**: Secure API token management
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Proper cross-origin resource sharing
- **SQL Injection Prevention**: Eloquent ORM protection

### Performance Optimizations
- **Eager Loading**: Prevents N+1 query problems
- **Database Indexing**: Optimized for common queries
- **Pagination**: Efficient large dataset handling
- **Query Scoping**: Reusable query constraints

## Development

### Running Tests
```bash
php artisan test
```

### Code Quality
```bash
# Run PHP CS Fixer
composer fix-cs

# Run PHPStan
composer analyse
```

### Database Operations
```bash
# Create migration
php artisan make:migration create_table_name

# Run specific migration
php artisan migrate --path=/database/migrations/filename.php

# Rollback migration
php artisan migrate:rollback

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

## Deployment

### Production Setup
1. Set `APP_ENV=production` in `.env`
2. Configure production database
3. Set up proper web server (Apache/Nginx)
4. Enable HTTPS
5. Configure caching and queues

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
```

## Contributing

This is a project showcasing Laravel development skills. The codebase demonstrates:

- Clean, maintainable code structure
- RESTful API design principles
- Database relationship modeling
- Authentication and authorization
- Input validation and security
- Error handling and logging
- Modern PHP development practices

## License

This project is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Contact

For questions about this project or collaboration opportunities, please reach out through the contact information in my portfolio.