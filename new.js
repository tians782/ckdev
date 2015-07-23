<script type="text/template" id="p_biz">
    <div class="swiper-slide p_ad last_page p_biz" data-aid="p_biz">
    <div class="wish wish_btn selected">祝福
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    </div>
    <div class="wish_txt">已收到<span class="num_wish"></span>0个祝福</div>
<div class="wish_txt info info1" data-name='p_biz_t1' onclick='ActionDialog();'>{{p_biz_t1}}</div>
<div class='wish_txt activity-words old_data' style='margin:-20px auto;cursor:pointer;width:85%;height:20px;line-height:24px;border:1px dashed #aaa;font-size:13px;color:#ccc;overflow:hidden;' onclick='ActionDialog();'>集祝福活动内容</div>
    <form>
    <input type="txt" class="tel"  placeholder="输入手机号领取优惠大礼包">
    <input type="button" class="tel_btn" id="tel_btn" value="免费领取">
    </form>
    <div class="merchant">
    <div class='company_name old_data' onclick='run();' style='cursor:pointer;'></div>
    <div class='info info2' data-name='p_biz_t2'>{{p_biz_t2}}</div>
<br>
<a href="{{p_biz_t3}}" class='info info3' data-name='p_biz_t3'>咨询电话</a>
    <a href="javascript:;" id='contact_phone_btn' class='old_data' onclick='run();'>咨询电话</a>
    </div>
    <div class="float_box">
    <p class="tip">填写信息，点击“确定”即可获得</p>
<input class="last_name" type="txt" placeholder="姓氏">
    <select class="sel_sex" id="sel_sex">
    <option value="先生" selected>先生</option>
<option value="女士">女士</option>
    </select>
    <input class="btn" type="button" value="确定">
    </div>
    <div class="trangle"></div>
    </div>
    </script>