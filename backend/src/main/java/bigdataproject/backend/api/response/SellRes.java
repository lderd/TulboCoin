package bigdataproject.backend.api.response;

import bigdataproject.backend.db.entity.Sell;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellRes {
    String sellCoinName;
    String sellCoinCode;
    Double sellCoinAmount;
    int sellCoinPrice;

    public static SellRes of(Sell sell){
        SellRes res = new SellRes();
        res.setSellCoinName(sell.getSellCoinName());
        res.setSellCoinCode(sell.getSellCoinCode());
        res.setSellCoinPrice(sell.getSellCoinPrice());
        res.setSellCoinAmount(sell.getSellCoinAmount());
        return res;
    }
}
