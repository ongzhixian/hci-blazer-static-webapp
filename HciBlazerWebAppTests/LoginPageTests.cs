using Microsoft.Playwright;

namespace HciBlazerWebAppTests;

[TestClass]
public class LoginPageTests : PageTest
{
    public override BrowserNewContextOptions ContextOptions()
    {
        var baseContextOptions = base.ContextOptions();
        baseContextOptions.BaseURL = TestContext.Properties["BaseUrl"]?.ToString() 
            ?? throw new ArgumentNullException("Undefined TestRunParameters 'BaseUrl'");
        return baseContextOptions;
    }
    
    [TestMethod]
    public async Task WhenGotoBaseUrlOnNewSession_DisplayLoginForm()
    {
        await Page.GotoAsync("/");

        await Expect(Page).ToHaveTitleAsync(new Regex("Log in | Hci-Blazer"));

        var pageHeading = Page.Locator("h1", new() { HasText = "Log in to Hci-Blazer" });
        Assert.IsTrue(await pageHeading.CountAsync() > 0, "No page heading found.");

        // Page should contain a username, password and log in button.

        var usernameInput = Page.Locator("input#usernameInput");
        Assert.IsTrue(await usernameInput.CountAsync() > 0, "No username input found.");

        var passwordInput = Page.Locator("input#passwordInput");
        Assert.IsTrue(await passwordInput.CountAsync() > 0, "No password input found.");

        var logInButton = Page.Locator("button#logInButton");
        Assert.IsTrue(await logInButton.CountAsync() > 0, "No log in button found.");

        // Expects the URL to contain intro.
        
        await Expect(Page).ToHaveURLAsync(new Regex(".*login.html"));

    }
}
