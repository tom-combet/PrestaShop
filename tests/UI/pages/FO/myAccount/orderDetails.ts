import FOBasePage from '@pages/FO/FObasePage';

import type {Page} from 'playwright';

/**
 * Order details page, contains functions that can be used on the page
 * @class
 * @extends FOBasePage
 */
class OrderDetails extends FOBasePage {
  public readonly pageTitle: string;

  public readonly successMessageText: string;

  private readonly headerTitle: string;

  private readonly reorderLink: string;

  private readonly invoiceLink: string;

  private readonly orderReturnForm: string;

  private readonly gridTable: string;

  private readonly returnTextarea: string;

  private readonly requestReturnButton: string;

  private readonly tableBody: string;

  private readonly tableBodyRows: string;

  private readonly tableBodyRow: (row: number) => string;

  private readonly tableBodyColumn: (row: number, column: number) => string;

  private readonly productName: (row: number, column: number) => string;

  private readonly downloadLink: (row: number, column: number) => string;

  private readonly productIdSelect: string;

  private readonly messageTextarea: string;

  private readonly submitMessageButton: string;

  private readonly deliveryAddressBox: string;

  private readonly invoiceAddressBox: string;

  /**
   * @constructs
   * Setting up texts and selectors to use on order details page
   */
  constructor() {
    super();

    this.pageTitle = 'Order details';
    this.successMessageText = 'Message successfully sent';

    // Selectors
    this.headerTitle = '.page-header h1';
    this.reorderLink = '#order-infos a';
    this.invoiceLink = '#order-infos div:nth-child(2) ul li:nth-child(3) a';

    // Order return form selectors
    this.orderReturnForm = '#order-return-form';
    this.gridTable = '#order-products';
    this.returnTextarea = `${this.orderReturnForm} textarea[name='returnText']`;
    this.requestReturnButton = `${this.orderReturnForm} button[name='submitReturnMerchandise']`;

    // Order products table body selectors
    this.tableBody = `${this.gridTable} tbody`;
    this.tableBodyRows = `${this.tableBody} tr`;
    this.tableBodyRow = (row: number) => `${this.tableBodyRows}:nth-child(${row})`;
    this.tableBodyColumn = (row, column) => `${this.tableBodyRow(row)} td:nth-child(${column})`;

    // Order product table content
    this.productName = (row, column) => `${this.tableBodyColumn(row, column)} a`;
    this.downloadLink = (row, column) => `${this.tableBodyColumn(row, column)} a[href]`;

    // Add message form selectors
    this.productIdSelect = '[name=id_product]';
    this.messageTextarea = '[name=msgText]';
    this.submitMessageButton = '[name=submitMessage]';

    // Order addresses block
    this.deliveryAddressBox = '#delivery-address';
    this.invoiceAddressBox = '#invoice-address';
  }

  /*
  Methods
   */

  /**
   * Download invoice
   * @param page {Page} Browser tab
   */
  downloadInvoice(page: Page): Promise<string | null> {
    return this.clickAndWaitForDownload(page, this.invoiceLink);
  }

  /**
   * Is invoice visible
   * @param page {Page} Browser tab
   */
  isInvoiceVisible(page: Page): Promise<boolean> {
    return this.elementVisible(page, this.invoiceLink);
  }

  /**
   * Is orderReturn form visible
   * @param page {Page} Browser tab
   * @returns {Promise<boolean>}
   */
  isOrderReturnFormVisible(page: Page): Promise<boolean> {
    return this.elementVisible(page, this.orderReturnForm, 1000);
  }

  /**
   * Request merchandise return
   * @param page {Page} Browser tab
   * @param messageText {string} Value of message text to set on return input
   * @returns {Promise<void>}
   */
  async requestMerchandiseReturn(page: Page, messageText: string): Promise<void> {
    await this.setChecked(page, `${this.tableBodyColumn(1, 1)} input`);
    await this.setValue(page, this.returnTextarea, messageText);
    await this.clickAndWaitForNavigation(page, this.requestReturnButton);
  }

  /**
   * Add a message to order history
   * @param page {Page} Browser tab
   * @param messageOption {String} The reference of the order
   * @param messageText {String} The message content
   * @returns {Promise<string>}
   */
  async addAMessage(page: Page, messageOption: string, messageText: string): Promise<string> {
    await this.selectByVisibleText(page, this.productIdSelect, messageOption);
    await this.setValue(page, this.messageTextarea, messageText);
    await this.clickAndWaitForNavigation(page, this.submitMessageButton);

    return this.getTextContent(page, this.alertSuccessBlock);
  }

  /**
   * Retrieve and return product name from order detail page
   * @param page {Page} Browser tab
   * @param row {Number} row in orders details table
   * @param column {Number} column in orders details table
   * @returns {Promise<string>}
   */
  getProductName(page: Page, row: number = 1, column: number = 1): Promise<string> {
    return this.getTextContent(page, this.productName(row, column));
  }

  /**
   * Click on download link
   * @param page {Page} Browser tab
   * @param row Number} row in orders details table
   * @param column {Number} column in orders details table
   * @returns {Promise<void>}
   */
  async clickOnDownloadLink(page: Page, row: number = 1, column: number = 1): Promise<void> {
    await this.waitForSelectorAndClick(page, this.downloadLink(row, column));
  }

  /**
   * @override
   * Get the page title from the main section
   * @param page {Page} Browser tab
   * @returns {Promise<string>}
   */
  async getPageTitle(page: Page): Promise<string> {
    return this.getTextContent(page, this.headerTitle);
  }

  /**
   * Click on the reorder link in the order detail
   * @param page {Page} Browser tab
   * @returns {Promise<void>}
   */
  async clickOnReorderLink(page: Page): Promise<void> {
    await this.clickAndWaitForNavigation(page, this.reorderLink);
  }

  /**
   * Get delivery address
   * @param page {Page} Browser tab
   * @returns {Promise<string>}
   */
  async getDeliveryAddress(page: Page): Promise<string> {
    return this.getTextContent(page, this.deliveryAddressBox);
  }

  /**
   * Get Invoice address
   * @param page {Page} Browser tab
   * @returns {Promise<string>}
   */
  async getInvoiceAddress(page: Page): Promise<string> {
    return this.getTextContent(page, this.invoiceAddressBox);
  }
}

export default new OrderDetails();
