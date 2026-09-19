import Script from "next/script";

/**
 * Microsoft Clarity (heatmaps + session recordings). Renders nothing unless a
 * project ID is provided. Loaded after the page is interactive so it never
 * blocks render.
 */
export function MicrosoftClarity({ projectId }: { projectId: string }) {
  if (!projectId) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${projectId}");`}
    </Script>
  );
}
