const res = await fetch('https://webhook.site/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cors: true,
    default_content_type: 'application/json',
    default_content: '{"ok":true}',
  }),
});
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
