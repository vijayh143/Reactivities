using System.Security.Claims;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;

using Microsoft.EntityFrameworkCore;
using Persistence;
using static Application.Comments.Create;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body { get; set; }

            public Guid ActivityId { get; set; }
        }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Body).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _mapper = mapper;
            _context = context;
        }

        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.FindAsync(request.ActivityId);
             

            if (activity == null) return null;

            var user2 = _userAccessor.GetUsername() ?? "bob";

            var user = await _context.Users
                    .Include(p => p.Photos)
                    .SingleOrDefaultAsync(x =>x.UserName == user2);
            
            /*var user1 = await _context.Users
                        .Include(p => p.Photos)
                        .FirstAsync();*/
            
            var comment = new Comment
            {
                Activity = activity,
                Author = user,
                Body = request.Body
            };

            activity.Comments.Add(comment);

            var success = await _context.SaveChangesAsync() > 0;

            if(success) return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));

            return Result<CommentDto>.Failure("Failed to create comment");
            
        }

      
    }
}