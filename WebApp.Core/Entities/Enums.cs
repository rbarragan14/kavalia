namespace WebApp.Core.Entities
{
    public enum ExternalLoginStatus
    {
        Ok = 0,
        Error = 1,
        Invalid = 2,
        TwoFactor = 3,
        Lockout = 4,
        CreateAccount = 5
    }

    public enum ScheduledEventType
    {
        Message = 0,
        Warning = 1,
        Error = 2
    }

    public enum ProcessingFileType
    {
        Upload = 1,
        Download
    }

    public enum ProcessingFileFormat
    {
        CSV = 1,
        Fixed
    }
}
