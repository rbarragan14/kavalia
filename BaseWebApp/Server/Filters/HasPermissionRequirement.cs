using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BaseWebApp.Server.Filters
{
    using Microsoft.AspNetCore.Authorization;

    public class HasPermissionRequirement : IAuthorizationRequirement
    {
    }
}
