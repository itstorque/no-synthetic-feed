# No Synthetic Feed

In anticipation of YouTube's [automatic labelling of AI generated videos](https://blog.youtube/news-and-events/improving-ai-labels-viewers-creators/), this extension will remove all videos flagged as containing synthetic content from your feed.
If you do find yourself on a youtube video that is AI generated, it will ask you (or rickroll you) before being able to watch a youtube video that is marked with AI generated content.

You need to create a google API key @ [google cloud console](https://console.cloud.google.com/apis/credentials), and specifically enable the `YouTube Data API v3` API.

This is a very basic extension and largely untested due to how hard it is to find videos labelled as containing synthetic media - but this should hopefully improve once it is rolled out.
Below is a screenshot of the current UI
<center>
<img width="159" height="202" src="https://github.com/user-attachments/assets/30170b86-0847-49d5-a2f2-a18b185c14ab" />
</center>
