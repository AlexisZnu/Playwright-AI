import { test, expect } from '@playwright/test';

/**
 * Clase SauceLabs - Contiene todos los pasos automatizados para pruebas en https://www.saucedemo.com/
 * Credenciales: username: standard_user, password: secret_sauce
 */
class SauceLabs {
  private page: any;
  private readonly baseURL = 'https://www.saucedemo.com/';
  private readonly username = 'standard_user';
  private readonly password = 'secret_sauce';

  constructor(page: any) {
    this.page = page;
  }

  /**
   * PASO 1: Navega a la página de login de Sauce Labs
   */
  async navigateToLogin(): Promise<void> {
    console.log('PASO 1: Navegando a https://www.saucedemo.com/');
    await this.page.goto(this.baseURL);
    await expect(this.page).toHaveTitle('Swag Labs');
    console.log('✓ Página de login cargada correctamente');
  }

  /**
   * PASO 2: Ingresa las credenciales de login
   */
  async login(): Promise<void> {
    console.log('PASO 2: Ingresando credenciales');
    
    // Ingresa el username
    const usernameInput = this.page.locator('[data-test="username"]');
    await usernameInput.fill(this.username);
    console.log(`✓ Username ingresado: ${this.username}`);

    // Ingresa la contraseña
    const passwordInput = this.page.locator('[data-test="password"]');
    await passwordInput.fill(this.password);
    console.log(`✓ Contraseña ingresada`);

    // Hace clic en el botón Login
    const loginButton = this.page.locator('[data-test="login-button"]');
    await loginButton.click();
    console.log('✓ Botón Login clickeado');

    // Espera a que cargue la página de productos
    await this.page.waitForURL('**/inventory.html');
    console.log('✓ Login exitoso - Página de inventario cargada');
  }

  /**
   * PASO 3: Verifica que la página de productos se carga correctamente
   */
  async verifyInventoryPage(): Promise<void> {
    console.log('PASO 3: Verificando página de productos');
    
    // Verifica que estamos en la página correcta
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    
    // Verifica que el título "Products" está visible
    const productsTitle = this.page.locator('[data-test="title"]');
    await expect(productsTitle).toBeVisible();
    
    console.log('✓ Página de productos verificada correctamente');
  }

  /**
   * PASO 4: Obtiene la lista de productos disponibles
   */
  async getProductList(): Promise<string[]> {
    console.log('PASO 4: Obteniendo lista de productos');
    
    const productLinks = await this.page.locator('[data-test*="item-"][data-test*="-img-link"]').allTextContents();
    console.log(`✓ Se encontraron ${productLinks.length} productos`);
    
    return productLinks;
  }

  /**
   * PASO 5: Agrega un producto al carrito por nombre
   */
  async addProductToCart(productName: string): Promise<void> {
    console.log(`PASO 5: Agregando "${productName}" al carrito`);
    
    // Busca el producto por su nombre
    const productLink = this.page.locator(`a:has-text("${productName}")`);
    await expect(productLink).toBeVisible();
    
    // Obtiene el contenedor del producto
    const productContainer = productLink.locator('..').locator('..');
    
    // Busca el botón "Add to cart" del producto
    const addButton = productContainer.locator('[data-test*="add-to-cart"]');
    await addButton.click();
    
    console.log(`✓ "${productName}" agregado al carrito`);
  }

  /**
   * PASO 6: Verifica que el carrito contiene productos
   */
  async verifyCartNotEmpty(): Promise<number> {
    console.log('PASO 6: Verificando que el carrito no está vacío');
    
    // Obtiene el badge del carrito que muestra la cantidad
    const cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');
    
    // Verifica que el badge es visible
    await expect(cartBadge).toBeVisible();
    
    // Obtiene el número de productos
    const cartCount = await cartBadge.textContent();
    const count = parseInt(cartCount || '0');
    
    console.log(`✓ Carrito contiene ${count} producto(s)`);
    return count;
  }

  /**
   * PASO 7: Abre el carrito
   */
  async openCart(): Promise<void> {
    console.log('PASO 7: Abriendo carrito');
    
    const cartLink = this.page.locator('[data-test="shopping-cart-link"]');
    await cartLink.click();
    
    // Espera a que cargue la página del carrito
    await this.page.waitForURL('**/cart.html');
    
    console.log('✓ Carrito abierto - Página de carrito cargada');
  }

  /**
   * PASO 8: Verifica los productos en el carrito
   */
  async verifyCartItems(): Promise<number> {
    console.log('PASO 8: Verificando items en el carrito');
    
    const cartItems = this.page.locator('[data-test="inventory-item"]');
    const count = await cartItems.count();
    
    console.log(`✓ El carrito contiene ${count} item(s)`);
    return count;
  }

  /**
   * PASO 9: Procede al checkout
   */
  async proceedToCheckout(): Promise<void> {
    console.log('PASO 9: Procediendo al checkout');
    
    const checkoutButton = this.page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    
    // Espera a que cargue la página de checkout
    await this.page.waitForURL('**/checkout-step-one.html');
    
    console.log('✓ Página de información de envío cargada');
  }

  /**
   * PASO 10: Completa los datos de envío
   */
  async fillShippingInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
    console.log('PASO 10: Completando información de envío');
    
    // Ingresa el nombre
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    console.log(`✓ Nombre ingresado: ${firstName}`);
    
    // Ingresa el apellido
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    console.log(`✓ Apellido ingresado: ${lastName}`);
    
    // Ingresa el código postal
    await this.page.locator('[data-test="postalCode"]').fill(zipCode);
    console.log(`✓ Código postal ingresado: ${zipCode}`);
  }

  /**
   * PASO 11: Continúa al siguiente paso del checkout
   */
  async continueCheckout(): Promise<void> {
    console.log('PASO 11: Continuando al siguiente paso');
    
    const continueButton = this.page.locator('[data-test="continue"]');
    await continueButton.click();
    
    // Espera a que cargue la página de revisión
    await this.page.waitForURL('**/checkout-step-two.html');
    
    console.log('✓ Página de revisión de orden cargada');
  }

  /**
   * PASO 12: Obtiene el total de la compra
   */
  async getOrderTotal(): Promise<string> {
    console.log('PASO 12: Obteniendo total de la orden');
    
    const total = this.page.locator('[data-test="total-label"]');
    const totalText = await total.textContent();
    
    console.log(`✓ Total: ${totalText}`);
    return totalText || '';
  }

  /**
   * PASO 13: Completa la compra
   */
  async finishOrder(): Promise<void> {
    console.log('PASO 13: Finalizando la compra');
    
    const finishButton = this.page.locator('[data-test="finish"]');
    await finishButton.click();
    
    // Espera a que cargue la página de confirmación
    await this.page.waitForURL('**/checkout-complete.html');
    
    console.log('✓ Compra completada exitosamente');
  }

  /**
   * PASO 14: Verifica el mensaje de confirmación
   */
  async verifyOrderConfirmation(): Promise<string> {
    console.log('PASO 14: Verificando mensaje de confirmación');
    
    const confirmMessage = this.page.locator('[data-test="complete-header"]');
    const message = await confirmMessage.textContent();
    
    await expect(confirmMessage).toBeVisible();
    
    console.log(`✓ Mensaje de confirmación: "${message}"`);
    return message || '';
  }

  /**
   * PASO 15: Cierra sesión
   */
  async logout(): Promise<void> {
    console.log('PASO 15: Cerrando sesión');
    
    // Abre el menú de hamburguesa
    const menuButton = this.page.locator('#react-burger-menu-btn');
    await menuButton.click();
    
    // Hace clic en logout
    const logoutLink = this.page.locator('[data-test="logout-sidebar-link"]');
    await logoutLink.click();
    
    // Espera a que vuelva a la página de login
    await this.page.waitForURL(this.baseURL);
    
    console.log('✓ Sesión cerrada correctamente');
  }
}

// ============================================================================
// SUITES DE PRUEBAS
// ============================================================================

test.describe('🛍️ Swag Labs - Pruebas de Compra Completa', () => {
  let sauceLabs: SauceLabs;

  test.beforeEach(async ({ page }) => {
    sauceLabs = new SauceLabs(page);
  });

  test('✅ Flujo Completo: Login → Seleccionar Producto → Comprar', async ({ page }) => {
    sauceLabs = new SauceLabs(page);

    // 1. Navega a login
    await sauceLabs.navigateToLogin();

    // 2. Realiza login
    await sauceLabs.login();

    // 3. Verifica página de productos
    await sauceLabs.verifyInventoryPage();

    // 4. Obtiene lista de productos
    await sauceLabs.getProductList();

    // 5. Agrega un producto al carrito
    await sauceLabs.addProductToCart('Sauce Labs Backpack');

    // 6. Verifica carrito
    const cartCount = await sauceLabs.verifyCartNotEmpty();
    expect(cartCount).toBeGreaterThan(0);

    // 7. Abre carrito
    await sauceLabs.openCart();

    // 8. Verifica items en carrito
    const itemsCount = await sauceLabs.verifyCartItems();
    expect(itemsCount).toBeGreaterThan(0);

    // 9. Procede al checkout
    await sauceLabs.proceedToCheckout();

    // 10. Completa información de envío
    await sauceLabs.fillShippingInfo('Juan', 'Pérez', '28001');

    // 11. Continúa al siguiente paso
    await sauceLabs.continueCheckout();

    // 12. Obtiene el total
    const total = await sauceLabs.getOrderTotal();
    expect(total).toBeTruthy();

    // 13. Finaliza la compra
    await sauceLabs.finishOrder();

    // 14. Verifica confirmación
    const confirmation = await sauceLabs.verifyOrderConfirmation();
    expect(confirmation).toContain('Thank you for your order!');

    // 15. Cierra sesión
    await sauceLabs.logout();
  });

  test('✅ Solo Login', async ({ page }) => {
    sauceLabs = new SauceLabs(page);

    await sauceLabs.navigateToLogin();
    await sauceLabs.login();
    await sauceLabs.verifyInventoryPage();
  });

  test('✅ Agregar Múltiples Productos al Carrito', async ({ page }) => {
    sauceLabs = new SauceLabs(page);

    await sauceLabs.navigateToLogin();
    await sauceLabs.login();

    // Agrega 3 productos diferentes
    await sauceLabs.addProductToCart('Sauce Labs Backpack');
    await sauceLabs.addProductToCart('Sauce Labs Bike Light');
    await sauceLabs.addProductToCart('Sauce Labs Bolt T-Shirt');

    // Verifica que el carrito tiene 3 productos
    const cartCount = await sauceLabs.verifyCartNotEmpty();
    expect(cartCount).toBe(3);
  });
});
