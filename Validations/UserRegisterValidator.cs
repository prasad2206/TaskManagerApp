using FluentValidation;
using TaskManagerApp.DTOs;

namespace TaskManagerApp.Validations
{
    public class UserRegisterValidator : AbstractValidator<UserRegisterDto>
    {
        public UserRegisterValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MinimumLength(3).WithMessage("Name must be at least 3 characters long");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long");

            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required");
        }
    }
}
