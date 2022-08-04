import { Component, OnInit } from '@angular/core';
import { CartService } from './../../../services/cart/cart.service';
import { Product } from './../../../services/product/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: Product[] = [
    {
      active: true,
      basePrice: 17.24,
      category: `Omega-3 Fish Oil`,
      composition: `<div class=\"preview-composition\">\r\n          <div style=\"min-width: 15px;\">1</div>\r\n          <div style=\"width: calc(100% - 65px);\">Calories</div>  \r\n          <div style=\"min-width: 50px;\">20</div>\r\n         </div>      \r\n      <div class=\"preview-composition\">\r\n          <div style=\"min-width: 15px;\">2</div>\r\n          <div style=\"width: calc(100% - 65px);\">Total Fat</div>  \r\n          <div style=\"min-width: 50px;\">2 g</div>\r\n         </div>      \r\n      <div class=\"preview-composition\">\r\n          <div style=\"min-width: 15px;\">3</div>\r\n          <div style=\"width: calc(100% - 65px);\">Vitamin E (as d-alpha tocopherol)</div>  \r\n          <div style=\"min-width: 50px;\">13.4 mg</div>\r\n         </div>      \r\n      `,
      description: `Igen - Non-GMO Testing\r\nFreshness & Potency Purity Guaranteed\r\n1,200 mg Omega-3s\r\nDietary Supplement\r\nCardiovascular Support\r\nBrain Function\r\nVision Health\r\nAn FDA Regulated Facility\r\nGluten-Free\r\nNo Artificial Preservatives\r\nCarlson Providing the finest Norwegian omega-3 since 1982\r\n\r\nSuper Omega-3 Gems® provide the beneficial omega-3's EPA and DHA, which supports heart, brain, vision and joint health, and promote optimal wellness. To ensure maximum freshness, Super Omega-3 Gems are closely managed from sea to store. We source the highest quality, deep, cold-water fish using traditional, sustainable methods.\r\n\r\nSuggested use\r\nAdults take two soft gels daily at mealtime.\r\n\r\nOther ingredients\r\nSoft gel shell: (beef gelatin, glycerin, water), mixed tocopherols.\r\n\r\nContains fish (anchovy, sardine and mackerel).\r\n\r\nPurity Guaranteed: This product is regularly tested by independent FDA registered laboratories. It has been determined to be fresh and fully potent (per ACOS international protocols) and is free of detrimental levels of mercury, cadmium, lead, PCBs and 28 other contaminants.\r\n\r\nDisclaimer\r\nWhile iHerb strives to ensure the accuracy of its product images and information, some manufacturing changes to packaging and/or ingredients may be pending update on our site. Although items may occasionally ship with alternate packaging, freshness is always guaranteed. We recommend that you read labels, warnings and directions of all products before use and not rely solely on the information provided by iHerb.`,
      fileEntityList: [
        {
          id: 121,
          mainFlag: true,
          name: "mwShoerC8SgC1.jpg",
          path: "http://localhost:8080/api/product/image/mwShoerC8SgC/mwShoerC8SgC1.jpg"
        },
        {
          id: 122,
          mainFlag: false,
          name: "mwShoerC8SgC2.jpg",
          path: "http://localhost:8080/api/product/image/mwShoerC8SgC/mwShoerC8SgC2.jpg"
        }
      ],
      manufacturer: `Carlson Labs`,
      name: `Carlson Labs, Wild Caught, Super Omega-3 Gems, 600 mg, 100 + 30 Soft Gels`,
      productId: `mwShoerC8SgC`,
      qty: `1`
    }
  ];

  constructor(
    private cartService: CartService
  ) {
    //this.cart = this.cartService.cart;
  }

  ngOnInit(): void {
    
  }

}
