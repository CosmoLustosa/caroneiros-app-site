// Script necessário apenas para o Firebase Cloud Messaging funcionar na Web.
// Para habilitar notificações push em background na web, adicione as credenciais do Firebase aqui no futuro.
self.addEventListener('push', function(event) {
  console.log('[ServiceWorker] Push Recebido.');
});
