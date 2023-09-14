using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using static Application.Activities.UpdateAttendance;



namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext dataContext, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _dataContext = dataContext;

        }
        
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _dataContext.Activities
                .Include(a => a.Attendees)
                .ThenInclude(s => s.AppUser)
                .FirstOrDefaultAsync(x => x.Id == request.Id);
            
            if (activity == null) return null;

            var user = await _dataContext.Users.FirstOrDefaultAsync(x => 
                x.UserName==_userAccessor.GetUsername()
            );

            var hostname = activity.Attendees.FirstOrDefault (x => x.IsHost).AppUser.UserName;

            var attendance = activity.Attendees.FirstOrDefault (x => x.AppUser.UserName == user.UserName);

            if(attendance!=null && hostname==user.UserName)
                activity.IsCancelled= !activity.IsCancelled;
            if(attendance!=null && hostname!=user.UserName)
                activity.Attendees.Remove(attendance);
            if(attendance==null)
            {
                attendance = new ActivityAttendee
                {
                    AppUser=user,
                    Activity= activity,
                    IsHost = false
                };
                activity.Attendees.Add(attendance);
            }
            
            var result = await _dataContext.SaveChangesAsync() > 0;

            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
                    
        }
    }
}