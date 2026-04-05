console.log('DEBUG: Entry point is executing');
const root = document.getElementById('root');
if (root) {
  root.innerHTML = '<h1 style="color: red; font-size: 48px; text-align: center; margin-top: 100px;">JS IS WORKING!</h1>';
} else {
  console.error('Root not found');
}
