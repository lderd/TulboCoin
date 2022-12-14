package bigdataproject.backend.api.response;

import bigdataproject.backend.common.model.response.BaseResponseBody;
import bigdataproject.backend.db.entity.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 로그인 API ([POST] /api/v1/auth) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("UserLoginPostResponse")
public class UserLoginPostRes extends BaseResponseBody {
    @ApiModelProperty(name="JWT 인증 토큰", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN...")
    String accessToken;

//    @ApiModelProperty(name="유저 정보", example="...")
////    User user;
//    Long userSeq;
//
//    String userId;
//
//    String imagePath;
//
//    String email;

    UserRes user;





    public static UserLoginPostRes of(Integer statusCode, String message, String accessToken, UserRes userRes) {
        UserLoginPostRes res = new UserLoginPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setAccessToken(accessToken);


        res.setUser(userRes);

//        res.setUserSeq(user.getUserSeq());
//        res.setUserId(user.getUserId());
//        res.setEmail(user.getEmail());
//        res.setImagePath(user.getImagePath());
        return res;
    }
}
