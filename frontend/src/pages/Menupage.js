import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   EMBEDDED CSS  (mirrors external cafe.css, h_ prefix)
───────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&family=Pinyon+Script&display=swap');

:root {
  --h-bg-deep:#0d0b08;--h-bg-dark:#141008;--h-bg-card:#1c1610;--h-bg-card2:#211a0e;
  --h-gold:#c9a84c;--h-gold-light:#e2c87e;--h-gold-pale:#f0dfa5;
  --h-cream:#f5efe0;--h-cream-dim:#c8bc9e;--h-white:#fdfaf3;
  --h-accent-red:#8b2e2e;--h-text-muted:#7a6e58;
  --h-border:rgba(201,168,76,0.18);--h-border-strong:rgba(201,168,76,0.45);
  --h-font-display:'Cormorant Garamond',serif;
  --h-font-script:'Pinyon Script',cursive;
  --h-font-body:'Jost',sans-serif;
  --h-radius:2px;--h-transition:0.4s cubic-bezier(0.25,0.46,0.45,0.94);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--h-bg-deep);color:var(--h-cream);font-family:var(--h-font-body);font-weight:300;line-height:1.7;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:var(--h-bg-deep);}::-webkit-scrollbar-thumb{background:var(--h-gold);border-radius:2px;}

/* NAVBAR */
.h_navbar{position:fixed;top:0;left:0;right:0;z-index:1000;padding:0 2rem;height:70px;display:flex;align-items:center;justify-content:space-between;background:rgba(13,11,8,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--h-border);transition:var(--h-transition);}
.h_navbar.h_scrolled{height:60px;background:rgba(13,11,8,0.98);}
.h_logo{font-family:var(--h-font-display);font-size:1.7rem;font-weight:500;color:var(--h-gold);letter-spacing:0.04em;text-decoration:none;line-height:1;cursor:pointer;}
.h_logo span{font-family:var(--h-font-script);font-size:2.2rem;color:var(--h-gold-light);display:block;line-height:0.6;}
.h_nav_links{display:flex;align-items:center;gap:2.5rem;list-style:none;}
.h_nav_link{font-size:0.72rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:var(--h-cream-dim);text-decoration:none;position:relative;transition:color var(--h-transition);cursor:pointer;}
.h_nav_link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:var(--h-gold);transition:width var(--h-transition);}
.h_nav_link:hover,.h_nav_link.h_active{color:var(--h-gold-light);}
.h_nav_link:hover::after,.h_nav_link.h_active::after{width:100%;}
.h_nav_btn{font-family:var(--h-font-body);font-size:0.68rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:var(--h-bg-deep);background:var(--h-gold);border:none;padding:0.55rem 1.4rem;cursor:pointer;transition:var(--h-transition);}
.h_nav_btn:hover{background:var(--h-gold-light);}
.h_hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:4px;}
.h_hamburger span{display:block;width:24px;height:1px;background:var(--h-gold);transition:var(--h-transition);}
.h_mobile_menu{display:none;position:fixed;top:70px;left:0;right:0;background:rgba(13,11,8,0.98);backdrop-filter:blur(20px);border-bottom:1px solid var(--h-border);padding:2rem;z-index:999;flex-direction:column;gap:1.5rem;}
.h_mobile_menu.h_open{display:flex;}
.h_mobile_link{font-size:0.8rem;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:var(--h-cream-dim);text-decoration:none;padding-bottom:1rem;border-bottom:1px solid var(--h-border);cursor:pointer;}

/* SHARED */
.h_section{padding:6rem 0;}.h_section_sm{padding:4rem 0;}
.h_section_tag{display:inline-flex;align-items:center;gap:0.8rem;font-size:0.68rem;font-weight:400;letter-spacing:0.25em;text-transform:uppercase;color:var(--h-gold);margin-bottom:1.2rem;}
.h_section_tag::before,.h_section_tag::after{content:'';display:block;width:30px;height:1px;background:var(--h-gold);opacity:0.6;}
.h_section_title{font-family:var(--h-font-display);font-weight:300;font-size:clamp(2.2rem,4vw,3.5rem);line-height:1.15;color:var(--h-white);margin-bottom:1rem;}
.h_section_title em{font-style:italic;color:var(--h-gold-light);}
.h_divider{width:60px;height:1px;background:linear-gradient(90deg,var(--h-gold),transparent);margin:1.5rem 0;}
.h_divider_center{margin:1.5rem auto;}
.h_lead{font-size:1rem;font-weight:300;color:var(--h-cream-dim);max-width:560px;line-height:1.9;}
.h_badge{display:inline-block;font-size:0.62rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;padding:0.3rem 0.8rem;border:1px solid var(--h-border-strong);color:var(--h-gold);border-radius:20px;}

/* BUTTONS */
.h_btn_gold{display:inline-flex;align-items:center;gap:0.7rem;font-family:var(--h-font-body);font-size:0.7rem;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;color:var(--h-bg-deep);background:var(--h-gold);border:none;padding:0.9rem 2.2rem;cursor:pointer;text-decoration:none;transition:var(--h-transition);position:relative;overflow:hidden;}
.h_btn_gold::before{content:'';position:absolute;inset:0;background:var(--h-gold-light);transform:translateX(-100%);transition:transform var(--h-transition);}
.h_btn_gold:hover::before{transform:translateX(0);}
.h_btn_gold span{position:relative;z-index:1;color:var(--h-bg-deep);}
.h_btn_outline{display:inline-flex;align-items:center;gap:0.7rem;font-family:var(--h-font-body);font-size:0.7rem;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;color:var(--h-gold);background:transparent;border:1px solid var(--h-border-strong);padding:0.9rem 2.2rem;cursor:pointer;text-decoration:none;transition:var(--h-transition);}
.h_btn_outline:hover{background:var(--h-border);border-color:var(--h-gold);color:var(--h-gold-light);}

/* MENU HERO */
.h_menu_hero{min-height:45vh;display:flex;align-items:flex-end;padding:7rem 0 3rem;position:relative;overflow:hidden;}
.h_menu_hero_bg{position:absolute;inset:0;background:radial-gradient(ellipse at 70% 0%,rgba(201,168,76,0.08) 0%,transparent 60%),radial-gradient(ellipse at 20% 100%,rgba(139,46,46,0.12) 0%,transparent 50%),var(--h-bg-deep);}
.h_menu_hero_bg::after{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(201,168,76,0.04) 39px,rgba(201,168,76,0.04) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(201,168,76,0.04) 39px,rgba(201,168,76,0.04) 40px);}
.h_menu_hero_eyebrow{font-family:var(--h-font-script);font-size:3.5rem;color:var(--h-gold);opacity:0.5;display:block;line-height:1;margin-bottom:0.5rem;}

/* TAB BAR */
.h_tab_bar{position:sticky;top:70px;z-index:100;background:var(--h-bg-deep);border-bottom:1px solid var(--h-border);}
.h_tab_inner{display:flex;overflow-x:auto;scrollbar-width:none;gap:0;}
.h_tab_inner::-webkit-scrollbar{display:none;}
.h_tab_btn{flex-shrink:0;font-family:var(--h-font-body);font-size:0.68rem;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:var(--h-text-muted);background:none;border:none;border-bottom:2px solid transparent;padding:1.1rem 1.8rem;cursor:pointer;transition:var(--h-transition);white-space:nowrap;display:flex;align-items:center;gap:0.5rem;}
.h_tab_btn:hover{color:var(--h-cream-dim);}
.h_tab_btn.h_tab_active{color:var(--h-gold);border-bottom-color:var(--h-gold);}
.h_tab_icon{font-size:1rem;}

/* MENU ITEMS */
.h_menu_section{padding:4rem 0;border-bottom:1px solid var(--h-border);}
.h_menu_section:last-child{border-bottom:none;}
.h_menu_section_header{display:flex;align-items:center;gap:1.5rem;margin-bottom:3rem;}
.h_menu_section_icon{font-size:2rem;width:52px;height:52px;display:flex;align-items:center;justify-content:center;background:var(--h-bg-card);border:1px solid var(--h-border);flex-shrink:0;}
.h_menu_section_name{font-family:var(--h-font-display);font-size:1.9rem;font-weight:400;color:var(--h-white);line-height:1;}
.h_menu_section_desc{font-size:0.78rem;color:var(--h-text-muted);letter-spacing:0.06em;margin-top:0.3rem;}
.h_menu_item{display:flex;align-items:flex-start;gap:1.2rem;padding:1.4rem 0;border-bottom:1px solid rgba(201,168,76,0.07);transition:var(--h-transition);cursor:default;}
.h_menu_item:last-child{border-bottom:none;}
.h_menu_item:hover{transform:translateX(6px);}
.h_menu_item_img{width:80px;height:80px;border-radius:var(--h-radius);flex-shrink:0;border:1px solid var(--h-border);font-size:2rem;display:flex;align-items:center;justify-content:center;background:var(--h-bg-card);overflow:hidden;}
.h_menu_item_body{flex:1;}
.h_menu_item_top{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:0.4rem;}
.h_menu_item_name{font-family:var(--h-font-display);font-size:1.15rem;font-weight:500;color:var(--h-white);line-height:1.2;}
.h_menu_item_price{font-family:var(--h-font-display);font-size:1.1rem;font-weight:400;color:var(--h-gold);white-space:nowrap;flex-shrink:0;}
.h_menu_item_desc{font-size:0.78rem;font-weight:300;color:var(--h-text-muted);line-height:1.6;margin-bottom:0.6rem;}
.h_menu_item_tags{display:flex;gap:0.4rem;flex-wrap:wrap;}
.h_tag{font-size:0.6rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;padding:0.2rem 0.55rem;border-radius:2px;}
.h_tag_veg{background:rgba(74,142,74,0.15);color:#7dbb7d;border:1px solid rgba(74,142,74,0.3);}
.h_tag_spicy{background:rgba(180,60,40,0.15);color:#e07a6a;border:1px solid rgba(180,60,40,0.3);}
.h_tag_new{background:rgba(201,168,76,0.15);color:var(--h-gold);border:1px solid var(--h-border-strong);}
.h_tag_popular{background:rgba(120,80,160,0.15);color:#b59ad6;border:1px solid rgba(120,80,160,0.3);}
.h_tag_gf{background:rgba(60,120,160,0.15);color:#7ab3d1;border:1px solid rgba(60,120,160,0.3);}

/* SPECIALS */
.h_specials_banner{background:linear-gradient(135deg,var(--h-bg-card) 0%,#1f1608 100%);border:1px solid var(--h-border);border-left:3px solid var(--h-gold);padding:1.8rem 2rem;margin-bottom:3rem;position:relative;overflow:hidden;}
.h_specials_banner::before{content:'✦';position:absolute;right:1.5rem;top:50%;transform:translateY(-50%);font-size:4rem;color:var(--h-gold);opacity:0.06;}
.h_specials_label{font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--h-gold);margin-bottom:0.4rem;}
.h_specials_text{font-family:var(--h-font-display);font-size:1.1rem;font-weight:400;color:var(--h-cream);font-style:italic;}

/* DRINKS */
.h_drink_card{background:var(--h-bg-card);border:1px solid var(--h-border);padding:1.5rem;transition:var(--h-transition);position:relative;overflow:hidden;height:100%;}
.h_drink_card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--h-gold),transparent);opacity:0;transition:opacity var(--h-transition);}
.h_drink_card:hover{transform:translateY(-4px);border-color:var(--h-border-strong);}
.h_drink_card:hover::before{opacity:1;}
.h_drink_emoji{font-size:2.2rem;margin-bottom:0.8rem;display:block;}
.h_drink_name{font-family:var(--h-font-display);font-size:1.1rem;font-weight:500;color:var(--h-white);margin-bottom:0.4rem;}
.h_drink_desc{font-size:0.75rem;color:var(--h-text-muted);line-height:1.6;margin-bottom:0.8rem;}
.h_drink_price{font-family:var(--h-font-display);font-size:1.05rem;color:var(--h-gold);}

/* ABOUT HERO */
.h_about_hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden;}
.h_about_hero_left{display:flex;flex-direction:column;justify-content:center;padding:8rem 4rem 8rem 2rem;position:relative;z-index:2;}
.h_about_hero_right{position:relative;overflow:hidden;}
.h_about_hero_img_overlay{position:absolute;inset:0;background:linear-gradient(90deg,var(--h-bg-deep) 0%,transparent 40%);}
.h_hero_year{font-family:var(--h-font-display);font-size:clamp(5rem,12vw,9rem);font-weight:300;color:var(--h-gold);opacity:0.1;position:absolute;bottom:2rem;right:2rem;line-height:1;pointer-events:none;}

/* STORY */
.h_story_section{padding:7rem 0;position:relative;overflow:hidden;}
.h_story_section::before{content:'"';font-family:var(--h-font-display);font-size:20rem;color:var(--h-gold);opacity:0.03;position:absolute;top:-2rem;left:-2rem;line-height:1;pointer-events:none;}
.h_story_grid{display:grid;grid-template-columns:1fr 1.2fr;gap:5rem;align-items:center;}
.h_story_img_wrap{position:relative;}
.h_story_img{width:100%;object-fit:cover;border:1px solid var(--h-border);}
.h_story_img_frame{position:absolute;top:1.5rem;left:1.5rem;right:-1.5rem;bottom:-1.5rem;border:1px solid var(--h-border);pointer-events:none;}
.h_story_badge_float{position:absolute;bottom:2rem;right:-2rem;background:var(--h-gold);color:var(--h-bg-deep);padding:1.2rem;text-align:center;min-width:90px;}
.h_story_badge_num{font-family:var(--h-font-display);font-size:2rem;font-weight:500;line-height:1;display:block;}
.h_story_badge_label{font-size:0.6rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;}
.h_story_body p{font-size:0.9rem;font-weight:300;color:var(--h-cream-dim);line-height:2;margin-bottom:1.2rem;}
.h_story_body p:first-of-type{font-family:var(--h-font-display);font-size:1.2rem;font-style:italic;color:var(--h-cream);line-height:1.7;}

/* TIMELINE */
.h_timeline{position:relative;padding:2rem 0;}
.h_timeline::before{content:'';position:absolute;top:0;bottom:0;left:0;width:1px;background:linear-gradient(180deg,transparent,var(--h-gold) 20%,var(--h-gold) 80%,transparent);}
.h_timeline_item{display:grid;grid-template-columns:80px 1fr;gap:1.5rem;padding:0 0 2.5rem 2rem;position:relative;}
.h_timeline_item::before{content:'';position:absolute;left:-3px;top:6px;width:7px;height:7px;background:var(--h-gold);border-radius:50%;}
.h_timeline_year{font-family:var(--h-font-display);font-size:1rem;font-weight:400;color:var(--h-gold);line-height:1.4;}
.h_timeline_text{font-size:0.8rem;color:var(--h-text-muted);line-height:1.7;}
.h_timeline_text strong{display:block;color:var(--h-cream);font-weight:400;margin-bottom:0.2rem;}

/* STATS */
.h_stats_row{background:var(--h-bg-card);border-top:1px solid var(--h-border);border-bottom:1px solid var(--h-border);padding:3rem 0;}
.h_stat_item{text-align:center;padding:1rem;}
.h_stat_num{font-family:var(--h-font-display);font-size:clamp(2.5rem,5vw,3.8rem);font-weight:300;color:var(--h-gold);line-height:1;display:block;}
.h_stat_label{font-size:0.68rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:var(--h-text-muted);display:block;margin-top:0.5rem;}

/* TEAM */
.h_team_section{padding:7rem 0;background:var(--h-bg-dark);}
.h_team_card{position:relative;overflow:hidden;cursor:pointer;}
.h_team_img_wrap{overflow:hidden;position:relative;}
.h_team_img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94),filter 0.6s ease;}
.h_team_card:hover .h_team_img{transform:scale(1.06);}
.h_team_overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(13,11,8,0.95) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;}
.h_team_name{font-family:var(--h-font-display);font-size:1.4rem;font-weight:500;color:var(--h-white);line-height:1.1;}
.h_team_role{font-size:0.68rem;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:var(--h-gold);margin-top:0.3rem;}
.h_team_bio{font-size:0.78rem;color:var(--h-cream-dim);line-height:1.6;margin-top:0.7rem;max-height:0;overflow:hidden;transition:max-height 0.5s ease,opacity 0.4s ease;opacity:0;}
.h_team_card:hover .h_team_bio{max-height:120px;opacity:1;}

/* GALLERY */
.h_ambience_section{padding:7rem 0;}
.h_ambience_intro{font-family:var(--h-font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:300;font-style:italic;color:var(--h-cream);line-height:1.6;text-align:center;max-width:700px;margin:0 auto 4rem;}
.h_gallery_grid{display:grid;grid-template-columns:repeat(12,1fr);gap:0.8rem;}
.h_gallery_item{overflow:hidden;position:relative;background:var(--h-bg-card);}
.h_gallery_item:nth-child(1){grid-column:span 7;grid-row:span 2;}
.h_gallery_item:nth-child(2){grid-column:span 5;}
.h_gallery_item:nth-child(3){grid-column:span 5;}
.h_gallery_item:nth-child(4){grid-column:span 4;}
.h_gallery_item:nth-child(5){grid-column:span 4;}
.h_gallery_item:nth-child(6){grid-column:span 4;}
.h_gallery_emoji_fill{width:100%;height:100%;min-height:180px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;background:var(--h-bg-card2);transition:transform 0.5s ease;}
.h_gallery_item:first-child .h_gallery_emoji_fill{min-height:380px;font-size:5rem;}
.h_gallery_item:hover .h_gallery_emoji_fill{transform:scale(1.06);}
.h_gallery_label{position:absolute;bottom:0;left:0;right:0;padding:1rem;background:linear-gradient(transparent,rgba(13,11,8,0.85));font-size:0.68rem;font-weight:400;letter-spacing:0.15em;text-transform:uppercase;color:var(--h-cream-dim);}

/* AMBIENCE FEATURES */
.h_ambience_features{margin-top:5rem;}
.h_feat_card{border:1px solid var(--h-border);background:var(--h-bg-card);padding:2rem 1.5rem;transition:var(--h-transition);height:100%;}
.h_feat_card:hover{border-color:var(--h-border-strong);transform:translateY(-4px);}
.h_feat_icon{font-size:1.8rem;margin-bottom:1rem;display:block;}
.h_feat_title{font-family:var(--h-font-display);font-size:1.1rem;font-weight:500;color:var(--h-white);margin-bottom:0.6rem;}
.h_feat_desc{font-size:0.78rem;color:var(--h-text-muted);line-height:1.7;}

/* QUOTE */
.h_quote_block{background:linear-gradient(135deg,var(--h-bg-card) 0%,var(--h-bg-card2) 100%);border:1px solid var(--h-border);border-top:3px solid var(--h-gold);padding:3rem 2.5rem;position:relative;margin:5rem 0;}
.h_quote_text{font-family:var(--h-font-display);font-size:clamp(1.2rem,2.5vw,1.7rem);font-weight:300;font-style:italic;color:var(--h-cream);line-height:1.7;margin-bottom:1.2rem;}
.h_quote_author{font-size:0.7rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:var(--h-gold);}

/* FOOTER */
.h_footer{background:#080603;border-top:1px solid var(--h-border);padding:5rem 0 2rem;}
.h_footer_logo{font-family:var(--h-font-script);font-size:3rem;color:var(--h-gold);line-height:1;margin-bottom:0.8rem;}
.h_footer_tagline{font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--h-text-muted);}
.h_footer_heading{font-size:0.68rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:var(--h-gold);margin-bottom:1.2rem;}
.h_footer_link{display:block;font-size:0.8rem;color:var(--h-text-muted);text-decoration:none;margin-bottom:0.6rem;transition:color var(--h-transition);cursor:pointer;}
.h_footer_link:hover{color:var(--h-cream-dim);}
.h_footer_bottom{border-top:1px solid var(--h-border);padding-top:1.5rem;margin-top:3rem;}
.h_footer_copy{font-size:0.7rem;color:var(--h-text-muted);}
.h_social_links{display:flex;gap:0.8rem;margin-top:1.2rem;}
.h_social_link{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid var(--h-border);color:var(--h-text-muted);text-decoration:none;font-size:0.85rem;transition:var(--h-transition);}
.h_social_link:hover{border-color:var(--h-gold);color:var(--h-gold);background:var(--h-border);}

/* PAGE TOGGLE */
.h_page{display:none;}.h_page.h_active_page{display:block;}

/* ANIMATIONS */
@keyframes h_fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes h_fadeIn{from{opacity:0;}to{opacity:1;}}
.h_anim_up{animation:h_fadeUp 0.8s ease forwards;}
.h_anim_up_2{animation:h_fadeUp 0.8s 0.15s ease both;}
.h_anim_up_3{animation:h_fadeUp 0.8s 0.3s ease both;}
.h_anim_up_4{animation:h_fadeUp 0.8s 0.45s ease both;}

/* RESPONSIVE */
@media(max-width:991px){
  .h_about_hero{grid-template-columns:1fr;}
  .h_about_hero_right{height:50vh;}
  .h_about_hero_left{padding:8rem 1.5rem 4rem;}
  .h_about_hero_img_overlay{background:linear-gradient(180deg,var(--h-bg-deep) 0%,transparent 30%,rgba(13,11,8,0.8) 100%);}
  .h_story_grid{grid-template-columns:1fr;gap:3rem;}
  .h_story_badge_float{right:1rem;bottom:-1.5rem;}
  .h_gallery_item:nth-child(1){grid-column:span 12;}
  .h_gallery_item:nth-child(2){grid-column:span 6;}
  .h_gallery_item:nth-child(3){grid-column:span 6;}
  .h_gallery_item:nth-child(4){grid-column:span 4;}
  .h_gallery_item:nth-child(5){grid-column:span 4;}
  .h_gallery_item:nth-child(6){grid-column:span 4;}
}
@media(max-width:767px){
  .h_nav_links{display:none;}.h_nav_btn{display:none;}.h_hamburger{display:flex;}
  .h_section{padding:4rem 0;}
  .h_about_hero_left{padding:7rem 1rem 3rem;}
  .h_gallery_item:nth-child(1){grid-column:span 12;}
  .h_gallery_item:nth-child(2){grid-column:span 12;}
  .h_gallery_item:nth-child(3){grid-column:span 12;}
  .h_gallery_item:nth-child(4){grid-column:span 6;}
  .h_gallery_item:nth-child(5){grid-column:span 6;}
  .h_gallery_item:nth-child(6){grid-column:span 12;}
  .h_menu_item_img{width:60px;height:60px;}
  .h_story_badge_float{position:static;margin-top:1rem;display:inline-block;}
}
@media(max-width:575px){
  .h_tab_btn{padding:0.9rem 1.2rem;font-size:0.62rem;}
  .h_gallery_item:nth-child(4),.h_gallery_item:nth-child(5){grid-column:span 12;}
}
`;

/* ─── BOOTSTRAP CDN ────────────────────────── */
function BootstrapLink() {
  useEffect(() => {
    if (!document.getElementById("bs-cdn")) {
      const l = document.createElement("link");
      l.id = "bs-cdn";
      l.rel = "stylesheet";
      l.href = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
      document.head.appendChild(l);
    }
  }, []);
  return null;
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const menuData = {
  starters: {
    icon: "🫕", label: "Starters", description: "Begin your journey",
    items: [
      { name: "Burrata Caprese", price: "₹480", desc: "Fresh burrata, heirloom tomatoes, aged balsamic, micro basil, Sicilian olive oil", tags: ["veg","gf"], emoji: "🧀" },
      { name: "Seared Scallop", price: "₹680", desc: "Pan-seared scallops, cauliflower purée, crispy capers, lemon butter sauce", tags: ["new","gf"], emoji: "🦪" },
      { name: "Truffle Arancini", price: "₹420", desc: "Crisp risotto balls with black truffle, fontina, saffron aioli", tags: ["veg","popular"], emoji: "🫙" },
      { name: "Lamb Kofta Skewers", price: "₹560", desc: "Spiced minced lamb, pomegranate molasses, house-made tzatziki, sumac onions", tags: ["spicy"], emoji: "🍢" },
    ],
  },
  mains: {
    icon: "🍽️", label: "Main Course", description: "Crafted with intention",
    items: [
      { name: "Wagyu Beef Tenderloin", price: "₹1,850", desc: "200g A5 wagyu, truffle butter, pomme purée, wild mushroom jus, charred asparagus", tags: ["gf","popular"], emoji: "🥩" },
      { name: "Pan-Seared Sea Bass", price: "₹1,200", desc: "Mediterranean sea bass, saffron beurre blanc, wilted spinach, cherry tomato confit", tags: ["gf","new"], emoji: "🐟" },
      { name: "Wild Mushroom Risotto", price: "₹780", desc: "Arborio rice, porcini, chanterelle, truffle oil, aged parmesan, chive oil", tags: ["veg","gf"], emoji: "🍄" },
      { name: "Lamb Rack Provençal", price: "₹1,600", desc: "Herb-crusted rack of lamb, ratatouille, garlic confit, rosemary jus, dauphinoise potatoes", tags: ["spicy"], emoji: "🍖" },
      { name: "Truffle Pappardelle", price: "₹920", desc: "Hand-rolled pasta, black truffle shavings, brown butter, parmesan crisp, crispy sage", tags: ["veg","popular"], emoji: "🍝" },
    ],
  },
  desserts: {
    icon: "🍮", label: "Desserts", description: "Sweet conclusions",
    items: [
      { name: "Valrhona Chocolate Fondant", price: "₹480", desc: "Warm dark chocolate lava cake, vanilla bean ice cream, gold leaf, raspberry coulis", tags: ["veg","popular"], emoji: "🍫" },
      { name: "Crème Brûlée", price: "₹360", desc: "Classic vanilla custard, caramelised sugar shell, seasonal berries, mint", tags: ["veg","gf","new"], emoji: "🍮" },
      { name: "Mango Panna Cotta", price: "₹320", desc: "Alphonso mango, coconut cream, passion fruit gel, toasted coconut flakes", tags: ["veg","gf"], emoji: "🥭" },
      { name: "Artisan Cheese Board", price: "₹680", desc: "Five artisan cheeses, honey comb, quince paste, assorted crackers, candied walnuts", tags: ["veg"], emoji: "🧀" },
    ],
  },
  drinks: {
    icon: "🍷", label: "Bar & Drinks", description: "Crafted libations",
    items: [],
    cards: [
      { name: "Eclipse Negroni", emoji: "🥃", desc: "Gin, Campari, smoked vermouth, orange zest, served in crystal", price: "₹680" },
      { name: "Saffron Mule", emoji: "🍋", desc: "Vodka, saffron-ginger syrup, lime, premium ginger beer, crystallised ginger", price: "₹560" },
      { name: "Velvet Rouge", emoji: "🍷", desc: "House Bordeaux blend, aged 18 months in French oak, notes of dark cherry", price: "₹480" },
      { name: "Garden Spritz", emoji: "🌿", desc: "Aperol, elderflower, cucumber, sparkling water, fresh herbs — non-alcoholic option available", price: "₹420" },
      { name: "Cold Brew Old Fashioned", emoji: "☕", desc: "Bourbon, cold brew concentrate, demerara, aromatic bitters, orange peel", price: "₹640" },
      { name: "The Moksha", emoji: "✨", desc: "Signature mocktail: rose water, lychee, basil seed, sparkling yuzu — a spiritual sip", price: "₹320" },
    ],
  },
};

const ambienceFeatures = [
  { icon: "🎶", title: "Live Jazz Fridays", desc: "Every Friday evening, curated jazz sessions breathe life into the dimly lit room." },
  { icon: "📚", title: "Curated Wine Library", desc: "Over 300 labels across Old and New World — our sommelier guides you through each season's picks." },
  { icon: "🕯️", title: "Candlelit Evenings", desc: "Hand-poured beeswax candles and pendant warmth create an intimate golden glow after dusk." },
  { icon: "🪴", title: "Botanical Interiors", desc: "Designed by Studio Verdure — living walls and curated botanicals weave nature into warm, textured spaces." },
  { icon: "🎭", title: "Private Dining Suites", desc: "Three exclusive rooms for celebrations, corporate dinners, and intimate proposals — each bespoke." },
  { icon: "☕", title: "Morning Café Culture", desc: "From 7 AM: specialty single-origin coffees, fresh patisserie, and the city slowly waking with you." },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function TagBadge({ tag }) {
  const map = { veg:["veg","Veg"], spicy:["spicy","Spicy"], new:["new","New"], popular:["popular","Popular"], gf:["gf","GF"] };
  const [cls, label] = map[tag] || ["new", tag];
  return <span className={`h_tag h_tag_${cls}`}>{label}</span>;
}

function MenuItem({ item }) {
  return (
    <div className="h_menu_item">
      <div className="h_menu_item_img">{item.emoji}</div>
      <div className="h_menu_item_body">
        <div className="h_menu_item_top">
          <span className="h_menu_item_name">{item.name}</span>
          <span className="h_menu_item_price">{item.price}</span>
        </div>
        <p className="h_menu_item_desc">{item.desc}</p>
        <div className="h_menu_item_tags">{item.tags.map(t => <TagBadge key={t} tag={t} />)}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = (page) => { setActivePage(page); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <nav className={`h_navbar${scrolled ? " h_scrolled" : ""}`}>
        <div className="h_logo" onClick={() => nav("menu")} style={{ cursor: "pointer" }}>
          <span>Aurum</span>
          Café & Bar
        </div>
        <ul className="h_nav_links">
          {[["Menu","menu"],["Our Story","about"],["Reservations",""],["Events",""],["Gallery",""]].map(([label, page]) => (
            <li key={label}>
              <span className={`h_nav_link${activePage === page ? " h_active" : ""}`} onClick={() => page && nav(page)}>
                {label}
              </span>
            </li>
          ))}
        </ul>
        <button className="h_nav_btn">Book a Table</button>
        <button className="h_hamburger" onClick={() => setMobileOpen(v => !v)}>
          <span style={{ transform: mobileOpen ? "rotate(45deg) translate(4px,4px)" : "" }} />
          <span style={{ opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ transform: mobileOpen ? "rotate(-45deg) translate(4px,-4px)" : "" }} />
        </button>
      </nav>
      <div className={`h_mobile_menu${mobileOpen ? " h_open" : ""}`}>
        {[["Menu","menu"],["Our Story","about"],["Reservations",""],["Events",""],["Gallery",""]].map(([label, page]) => (
          <span key={label} className="h_mobile_link" onClick={() => { if(page) nav(page); else setMobileOpen(false); }}>{label}</span>
        ))}
        <button className="h_btn_gold" style={{ justifyContent: "center" }}><span>Book a Table</span></button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MENU PAGE
───────────────────────────────────────────── */
function MenuPage() {
  const [activeTab, setActiveTab] = useState("starters");
  const tabs = [
    { key: "starters", icon: "🫕", label: "Starters" },
    { key: "mains",    icon: "🍽️", label: "Mains" },
    { key: "desserts", icon: "🍮", label: "Desserts" },
    { key: "drinks",   icon: "🍷", label: "Bar & Drinks" },
  ];
  const cat = menuData[activeTab];

  return (
    <div>
      {/* Hero */}
      <section className="h_menu_hero">
        <div className="h_menu_hero_bg" />
        <div className="container position-relative">
          <span className="h_menu_hero_eyebrow">Menu</span>
          <div className="h_section_tag h_anim_up"><span>Aurum Café & Bar</span></div>
          <h1 className="h_section_title h_anim_up_2" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}>
            A Culinary<br /><em>Journey</em>
          </h1>
          <div className="h_divider h_anim_up_3" />
          <p className="h_lead h_anim_up_4" style={{ maxWidth: 460 }}>
            Seasonal ingredients, timeless technique, and quiet artistry — each dish a chapter, each visit a story.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="h_tab_bar">
        <div className="container">
          <div className="h_tab_inner">
            {tabs.map(t => (
              <button key={t.key} className={`h_tab_btn${activeTab === t.key ? " h_tab_active" : ""}`} onClick={() => setActiveTab(t.key)}>
                <span className="h_tab_icon">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="h_menu_section">
          <div className="h_specials_banner">
            <div className="h_specials_label">Today's Chef's Selection</div>
            <div className="h_specials_text">"We forage our herbs each morning and plate our dreams each evening — tonight, trust the tasting menu."</div>
          </div>
          <div className="h_menu_section_header">
            <div className="h_menu_section_icon">{cat.icon}</div>
            <div>
              <div className="h_menu_section_name">{cat.label}</div>
              <div className="h_menu_section_desc">{cat.description}</div>
            </div>
          </div>
          {cat.items && cat.items.length > 0 && (
            <div className="row">
              <div className="col-lg-6">{cat.items.filter((_,i)=>i%2===0).map(item=><MenuItem key={item.name} item={item}/>)}</div>
              <div className="col-lg-6">{cat.items.filter((_,i)=>i%2!==0).map(item=><MenuItem key={item.name} item={item}/>)}</div>
            </div>
          )}
          {cat.cards && (
            <div className="row g-3">
              {cat.cards.map(d => (
                <div key={d.name} className="col-sm-6 col-lg-4">
                  <div className="h_drink_card">
                    <span className="h_drink_emoji">{d.emoji}</span>
                    <div className="h_drink_name">{d.name}</div>
                    <div className="h_drink_desc">{d.desc}</div>
                    <div className="h_drink_price">{d.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="d-flex flex-wrap gap-3 pb-5 pt-3" style={{ borderTop:"1px solid rgba(201,168,76,0.1)", marginTop:"1rem" }}>
          {[["veg","Vegetarian"],["spicy","Spicy"],["gf","Gluten-Free"],["new","New Dish"],["popular","Chef's Favourite"]].map(([k,l])=>(
            <span key={k} className={`h_tag h_tag_${k}`}>{l}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:"var(--h-bg-card)",borderTop:"1px solid var(--h-border)",borderBottom:"1px solid var(--h-border)",padding:"3rem 0" }}>
        <div className="container text-center">
          <div className="h_section_tag" style={{ justifyContent:"center" }}>Reserve Your Evening</div>
          <h3 className="h_section_title" style={{ fontSize:"2rem" }}>Dine with <em>Intention</em></h3>
          <p className="h_lead mx-auto text-center mb-4" style={{ maxWidth:400 }}>Our tasting menus are seasonal and limited — reservations recommended.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="h_btn_gold"><span>Reserve a Table</span></button>
            <button className="h_btn_outline">Private Dining Enquiry</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────────── */
function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="h_about_hero">
        <div className="h_about_hero_left" style={{ paddingLeft:"max(1.5rem, calc((100% - 1140px)/2 + 1rem))" }}>
          <div className="h_section_tag h_anim_up">Est. 2016 · Surat, India</div>
          <h1 className="h_section_title h_anim_up_2" style={{ fontSize:"clamp(2.8rem,5.5vw,5rem)" }}>
            Where Every<br />Dish Tells a<br /><em>Story</em>
          </h1>
          <div className="h_divider h_anim_up_3" />
          <p className="h_lead h_anim_up_4">
            Aurum was born from a single belief — that a meal shared in a beautiful room, cooked with honest hands, is one of life's finest pleasures.
          </p>
          <div className="d-flex gap-3 flex-wrap mt-4 h_anim_up_4">
            <button className="h_btn_gold"><span>Reserve a Table</span></button>
            <button className="h_btn_outline">View Menu</button>
          </div>
        </div>
        <div className="h_about_hero_right">
          <div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#1c1008 0%,#2a1a05 40%,#0d0b08 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9rem",minHeight:"100vh" }}>🏛️</div>
          <div className="h_about_hero_img_overlay" />
          <div className="h_hero_year">2016</div>
        </div>
      </section>

      {/* Stats */}
      <div className="h_stats_row">
        <div className="container">
          <div className="row">
            {[["8+","Years of Excellence"],["12,000+","Guests Served"],["3","Michelin Stars"],["47","Ingredients Sourced Locally"]].map(([n,l])=>(
              <div key={l} className="col-6 col-md-3">
                <div className="h_stat_item"><span className="h_stat_num">{n}</span><span className="h_stat_label">{l}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="h_story_section">
        <div className="container">
          <div className="h_story_grid">
            <div className="h_story_img_wrap">
              <div className="h_story_img" style={{ background:"linear-gradient(160deg,#1c1008,#2a1a08,#0d0b08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"6rem",aspectRatio:"4/5" }}>🍽️</div>
              <div className="h_story_img_frame" />
              <div className="h_story_badge_float">
                <span className="h_story_badge_num">8</span>
                <span className="h_story_badge_label">Years</span>
              </div>
            </div>
            <div className="h_story_body">
              <div className="h_section_tag">Our Story</div>
              <h2 className="h_section_title">From a Dream to a<br /><em>Destination</em></h2>
              <div className="h_divider" />
              <p>Aurum opened its doors in 2016 in the heart of Surat, born from the vision of chef Arjun Mehta and his partner Riya — a chef's notebook filled with memories of his grandmother's kitchen in Jodhpur and the starred kitchens of Paris.</p>
              <p>The name Aurum — Latin for gold — speaks not to opulence but to warmth. The warmth of a room lit by candlelight. The warmth of a dish that arrives exactly right. The warmth you feel when a stranger behind the kitchen pass has cooked for you as if you were family.</p>
              <p>Today Aurum has grown into a café, restaurant, and bar — each space distinct in character but unified by the same unhurried attention. We source our produce weekly from local farms, brew our coffee from single-origin beans, and age our cocktails in small-batch barrels.</p>
              <div className="h_timeline mt-4">
                {[["2016","Aurum Opens","A 22-seat restaurant in a heritage Surat bungalow."],
                  ["2018","Bar & Cellar Added","Marco Rossetti joins; our curated bar programme launches."],
                  ["2020","Morning Café","We open our all-day café wing — specialty coffee and patisserie."],
                  ["2023","First Michelin Recognition","Awarded one Michelin star — a quiet, proud morning."],
                  ["2024","Private Dining Suites","Three intimate dining rooms for bespoke experiences."],
                ].map(([yr,title,text])=>(
                  <div key={yr} className="h_timeline_item">
                    <div className="h_timeline_year">{yr}</div>
                    <div className="h_timeline_text"><strong>{title}</strong>{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <div className="container">
        <div className="h_quote_block">
          <div className="h_quote_text">"Food is memory. Every plate we send out is a handshake — between the farmer who grew the ingredient, the cook who transformed it, and the person who receives it. That handshake matters deeply."</div>
          <div className="h_quote_author">— Arjun Mehta, Executive Chef & Founder</div>
        </div>
      </div>

      {/* Team */}
      <section className="h_team_section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="h_section_tag" style={{ justifyContent:"center" }}>The People</div>
            <h2 className="h_section_title">Hands Behind the<br /><em>Magic</em></h2>
            <div className="h_divider h_divider_center" />
            <p className="h_lead mx-auto text-center">A small, fiercely dedicated team who have traded sleep for craft — each one a specialist, together a family.</p>
          </div>
          <div className="row g-3 align-items-start">
            {/* Featured */}
            <div className="col-md-5">
              <div className="h_team_card">
                <div className="h_team_img_wrap" style={{ aspectRatio:"3/3.8" }}>
                  <div className="h_team_img" style={{ background:"linear-gradient(160deg,#1a1008,#2e1a06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8rem",height:"100%" }}>👨‍🍳</div>
                  <div className="h_team_overlay">
                    <span className="h_badge mb-2">Head Chef</span>
                    <div className="h_team_name" style={{ fontSize:"1.7rem" }}>Arjun Mehta</div>
                    <div className="h_team_role">Executive Chef & Founder</div>
                    <div className="h_team_bio">Trained at Le Cordon Bleu Paris, with stages at Alain Ducasse and Nobu. Arjun weaves his Rajasthani roots into every contemporary plate. His philosophy: season boldly, plate quietly.</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Rest */}
            <div className="col-md-7">
              <div className="row g-3">
                {[
                  { name:"Priya Krishnan", role:"Pastry Chef", bio:"A CACAO Award winner. Priya's desserts are poetic architecture — edible art that melts into memory.", emoji:"👩‍🍳" },
                  { name:"Marco Rossetti", role:"Bar Director", bio:"Former head mixologist at Zuma London. Marco curates each cocktail as a narrative — flavour, aroma, theatre.", emoji:"🍸" },
                  { name:"Kavya Nair", role:"Restaurant Manager", bio:"With a decade at Oberoi properties, Kavya's warm precision turns every table into a private stage.", emoji:"🌟" },
                ].map(m=>(
                  <div key={m.name} className="col-sm-4">
                    <div className="h_team_card">
                      <div className="h_team_img_wrap" style={{ aspectRatio:"3/4" }}>
                        <div className="h_team_img" style={{ background:"linear-gradient(160deg,#1a1008,#241406)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4rem",height:"100%" }}>{m.emoji}</div>
                        <div className="h_team_overlay">
                          <div className="h_team_name">{m.name}</div>
                          <div className="h_team_role">{m.role}</div>
                          <div className="h_team_bio">{m.bio}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row g-3 mt-1">
                {[["🌱","Seasonal First","We redesign our menu four times a year around what's fresh."],
                  ["🤝","Supplier Bonds","We visit our 12 partner farms annually — we know who grows our food."],
                  ["🔥","Open Kitchen","Dine at our chef's counter and watch each plate take shape."]
                ].map(([ic,ti,de])=>(
                  <div key={ti} className="col-sm-4">
                    <div className="h_feat_card" style={{ height:"auto" }}>
                      <span className="h_feat_icon">{ic}</span>
                      <div className="h_feat_title" style={{ fontSize:"0.9rem" }}>{ti}</div>
                      <div className="h_feat_desc" style={{ fontSize:"0.72rem" }}>{de}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ambience */}
      <section className="h_ambience_section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="h_section_tag" style={{ justifyContent:"center" }}>The Space</div>
            <h2 className="h_section_title">An <em>Atmosphere</em> You Feel<br />Before You See It</h2>
            <div className="h_divider h_divider_center" />
          </div>
          <p className="h_ambience_intro">
            Warm teak, hand-thrown ceramics, the low hum of jazz, and the faint sweetness of beeswax — Aurum is designed to make the world outside grow quiet.
          </p>
          <div className="h_gallery_grid">
            {[["🏛️","The Main Hall"],["🕯️","Candlelit Table"],["🍷","Wine Cellar"],["☕","Morning Café"],["🎵","Jazz Corner"],["🌿","Garden Terrace"]].map(([em,label],i)=>(
              <div key={label} className="h_gallery_item">
                <div className="h_gallery_emoji_fill">{em}</div>
                <div className="h_gallery_label">{label}</div>
              </div>
            ))}
          </div>
          <div className="h_ambience_features">
            <div className="row g-3">
              {ambienceFeatures.map(f=>(
                <div key={f.title} className="col-sm-6 col-lg-4">
                  <div className="h_feat_card">
                    <span className="h_feat_icon">{f.icon}</span>
                    <div className="h_feat_title">{f.title}</div>
                    <div className="h_feat_desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ background:"var(--h-bg-card)",borderTop:"1px solid var(--h-border)",padding:"5rem 0" }}>
        <div className="container text-center">
          <div className="h_section_tag" style={{ justifyContent:"center" }}>Come Find Us</div>
          <h2 className="h_section_title" style={{ fontSize:"2.5rem" }}>Your Table is<br /><em>Waiting</em></h2>
          <p className="h_lead mx-auto text-center mb-4" style={{ maxWidth:400 }}>Lunch, dinner, a quiet morning coffee, or a celebratory evening — Aurum holds space for all of it.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
            <button className="h_btn_gold"><span>Reserve Now</span></button>
            <button className="h_btn_outline">Contact Us</button>
          </div>
          <p style={{ fontSize:"0.75rem",color:"var(--h-text-muted)",letterSpacing:"0.1em" }}>
            📍 12 Heritage Lane, Nanpura, Surat &nbsp;·&nbsp; 📞 +91 98765 43210 &nbsp;·&nbsp; ⏰ Mon–Sun 7:00 AM – 11:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer({ setActivePage }) {
  return (
    <footer className="h_footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-md-4">
            <div className="h_footer_logo">Aurum</div>
            <div className="h_footer_tagline">Café · Restaurant · Bar</div>
            <p style={{ fontSize:"0.78rem",color:"var(--h-text-muted)",lineHeight:1.8,marginTop:"1rem" }}>A warm room, honest food, and time well spent — this is what we offer, and we mean it entirely.</p>
            <div className="h_social_links">
              {["📸","🐦","📘","📌"].map((s,i)=><span key={i} className="h_social_link">{s}</span>)}
            </div>
          </div>
          <div className="col-6 col-md-2">
            <div className="h_footer_heading">Navigate</div>
            {[["Menu","menu"],["Our Story","about"],["Reservations",""],["Events",""],["Gallery",""]].map(([label,page])=>(
              <span key={label} className="h_footer_link" onClick={()=>page && setActivePage(page)}>{label}</span>
            ))}
          </div>
          <div className="col-6 col-md-2">
            <div className="h_footer_heading">Experiences</div>
            {["Tasting Menu","Wine Pairing","Chef's Counter","Private Dining","Morning Café"].map(l=>(
              <span key={l} className="h_footer_link">{l}</span>
            ))}
          </div>
          <div className="col-md-4">
            <div className="h_footer_heading">Find Us</div>
            <p style={{ fontSize:"0.78rem",color:"var(--h-text-muted)",lineHeight:2 }}>
              12 Heritage Lane, Nanpura<br/>Surat, Gujarat 395001<br/><br/>
              +91 98765 43210<br/>hello@aurumcafe.in<br/><br/>
              Mon – Sun: 7:00 AM – 11:00 PM
            </p>
          </div>
        </div>
        <div className="h_footer_bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="h_footer_copy">© 2024 Aurum Café & Bar. Crafted with care in Surat.</div>
          <div className="d-flex gap-3">
            {["Privacy","Terms","Accessibility"].map(l=>(
              <span key={l} className="h_footer_link" style={{ marginBottom:0,fontSize:"0.68rem" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  const [activePage, setActivePage] = useState("menu");

  return (
    <>
      <BootstrapLink />
      <style>{STYLES}</style>
      <div style={{ paddingTop: "70px" }}>
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <div className={`h_page${activePage==="menu"?" h_active_page":""}`}><MenuPage /></div>
        <div className={`h_page${activePage==="about"?" h_active_page":""}`}><AboutPage /></div>
        <Footer setActivePage={setActivePage} />
      </div>
    </>
  );
}