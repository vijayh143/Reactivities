using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccesor _photoAccesor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccesor photoAccesor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccesor = photoAccesor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var usr = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                
                if (usr == null) return null;

                var photo = usr.Photos.FirstOrDefault(x => x.Id == request.Id);

                if(photo == null) return null;

                if(photo.IsMain) return Result<Unit>.Failure("You cannot delete your main photo");

                var result = await _photoAccesor.DeletePhoto(photo.Id);
                
                if(result== null) return Result<Unit>.Failure("Problem deleting the photo in Cloudinary");
                
                usr.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting the photo from API");

            }
        }
    }
}