package bigdataproject.backend.api.controller;

import bigdataproject.backend.api.request.UserLoginPostReq;
import bigdataproject.backend.api.request.UserRegisterReq;
import bigdataproject.backend.api.request.UserUpdateReq;
import bigdataproject.backend.api.response.UserInfoRes;
import bigdataproject.backend.api.response.UserLoginPostRes;
import bigdataproject.backend.api.response.UserRes;
import bigdataproject.backend.api.service.UserService;
import bigdataproject.backend.common.auth.TulUserDetails;
import bigdataproject.backend.common.model.response.BaseResponseBody;
import bigdataproject.backend.common.model.response.BaseResponseBodyAndError;
import bigdataproject.backend.common.util.JwtTokenUtil;
import bigdataproject.backend.db.entity.User;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthUserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @ApiOperation(value = "로그인", notes = "<strong>아이디와 패스워드</strong>를 통해 로그인 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class)
    })
    public ResponseEntity<UserLoginPostRes> login(
            @RequestBody @ApiParam(value="로그인 정보", required = true) UserLoginPostReq loginInfo) {
        String userId = loginInfo.getUserId();
        String password = loginInfo.getPassword();

        User user = userService.getUserByUserId(userId);
        
        if (user == null){
            return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "해당 유저가 존재하지 않습니다", null, null));
        }
        // 로그인 요청한 유저로부터 입력된 패스워드 와 디비에 저장된 유저의 암호화된 패스워드가 같은지 확인.(유효한 패스워드인지 여부 확인)
        if(passwordEncoder.matches(password, user.getPassword())) {
            // 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
//          // user를 userRes로 변환한 다음에 담아줌
            return ResponseEntity.status(200).body(UserLoginPostRes.of(200, "로그인 되었습니다", JwtTokenUtil.getToken(userId), UserRes.of(user)));
        }
        // 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
        return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "비밀번호가 잘못되었습니다", null, null));
    }

    //로그인한 회원 본인의 정보 조회
    @GetMapping("my-info")
    @ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다.")
    public ResponseEntity<UserInfoRes> getMyInfo(
            @ApiIgnore Authentication authentication) {
        TulUserDetails userDetails = (TulUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);
        // 토큰에 문제가 있을 때
        if (authentication == null) {
            return ResponseEntity.status(403).body(UserInfoRes.of(403, "토큰이 없습니다", null));
        }

        if (!user.getUserId().equals(userId)) {
            return ResponseEntity.status(403).body(UserInfoRes.of(403, "회원 정보가 일치하지 않습니다", null));
        }
        return ResponseEntity.status(200).body(UserInfoRes.of(200, "회원 정보를 가져왔습니다", UserRes.of(user)));
    }


//    로그인한 회원 본인의 정보 수정
    @PutMapping ("my-info")
    @ApiOperation(value = "회원 본인 정보 수정", notes = "로그인한 회원 본인의 정보를 수정한다.")
    public ResponseEntity<?> updateMyInfo( @ApiIgnore Authentication authentication, @Validated @RequestBody UserUpdateReq updateInfo,  BindingResult bindingResult) {
        TulUserDetails userDetails = (TulUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream().map(e -> e.getDefaultMessage()).collect(Collectors.toList());
            return ResponseEntity.status(401).body(BaseResponseBodyAndError.of(401, "이메일 형식이 아닙니다.", errors));
        }

        if (userId.equals(updateInfo.getUserId())) {
            User user = userService.updateUserInfo(userId, updateInfo);
            if (user == null)
                return ResponseEntity.status(403).body(UserInfoRes.of(405, "인증이 만료되었습니다. 다시 로그인 해주세요.", null));
            return ResponseEntity.status(200).body(UserInfoRes.of(200, "회원 정보를 수정했습니다", UserRes.of(user)));
        }
        return ResponseEntity.status(400).body(UserInfoRes.of(400, "잘못된 요청입니다.", null));
    }


    //로그인한 회원 본인의 탈퇴 요청
    @DeleteMapping("my-info")
    @ApiOperation(value = "회원 본인의 탈퇴 요청", notes = "로그인한 회원을 탈퇴한다.")
    public ResponseEntity<?> DeleteMyInfo ( @ApiIgnore Authentication authentication){
        if (authentication == null) {
            return new ResponseEntity<>("인증이 만료되었습니다. 다시 로그인 해주세요", HttpStatus.valueOf(403));
        }
        TulUserDetails userDetails = (TulUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserId(userId);

        if (user == null) {
            return new ResponseEntity<>(userId + "의 회원 정보가 없습니다", HttpStatus.valueOf(404));
        }
        userService.deleteUser(user);
        return new ResponseEntity<>(userId + "의 회원 정보가 삭제되었습니다", HttpStatus.valueOf(200));
    }

}


