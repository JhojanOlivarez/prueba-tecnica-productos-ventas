namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string Email { get; set; } = null!;

        public string FullName { get; set; } = null!;

        // Guardamos el hash, no la contraseña en texto plano
        public string PasswordHash { get; set; } = null!;

        public string Role { get; set; } = "User";
    }
}
