using Api.DTOs.Auth;
using Api.Helpers;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Services
{
    public class AuthService
    {
        private readonly AppDbContext _db;
        private readonly JwtGenerator _jwt;

        public AuthService(AppDbContext db, JwtGenerator jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        public async Task<AuthResponse> Register(RegisterRequest request)
        {
            var exists = await _db.Users.AnyAsync(u => u.Email == request.Email);
            if (exists)
            {
                throw new Exception("User already exists.");
            }

            var user = new User
            {
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);

            return new AuthResponse
            {
                Email = user.Email,
                FullName = user.FullName,
                Token = token
            };
        }

        public async Task<AuthResponse> Login(LoginRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid credentials.");
            }

            var token = _jwt.GenerateToken(user);

            return new AuthResponse
            {
                Email = user.Email,
                FullName = user.FullName,
                Token = token
            };
        }
    }
}
