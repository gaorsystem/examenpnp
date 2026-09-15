import fs from 'fs';

async function test(url) {
  const formAction = url.replace('/viewform', '/formResponse');
  const res = await fetch(formAction, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'fvv=1&pageHistory=0'
  });
  const text = await res.text();
  console.log('Status:', res.status);
  const match = text.match(/\/viewscore\?[^"'\s\<\>]+/);
  console.log('Viewscore URL match:', match ? match[0] : null);
}

test('https://docs.google.com/forms/d/e/1FAIpQLSdLsIaoEYCRzADxoJ5soQWDadJmnvKpZ3vh708mLHMesrazPg/viewform');
