using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccesor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }
        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if(file.Length>0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams{
                    File= new FileDescription(file.FileName,stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if(uploadResult.Error!=null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                return new PhotoUploadResult{
                    PhotoId= uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString()
                };

            }
            else
                return null;
            
            
        }

        public async Task<string> DeletePhoto(string photoId)
        {
            var deleteParams= new DeletionParams(photoId);
            var deleteResult=await _cloudinary.DestroyAsync(deleteParams);

            return deleteResult.Result == "ok" ? deleteResult.Result : null;
        }
    }
}