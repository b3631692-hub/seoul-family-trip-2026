import os, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('/mnt/data/seoul-trip-planner/tests')
URL='http://127.0.0.1:4173'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for dev,width,height in [('desktop',1440,900),('mobile',390,844)]:
  context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,has_touch=dev=='mobile',is_mobile=dev=='mobile')
  page=context.new_page()
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(URL,wait_until='domcontentloaded',timeout=30000)
  page.wait_for_selector('#calendarBody .timeline-card, #calendarBody .week-event',timeout=25000)
  page.wait_for_timeout(900)
  print(dev,'title',page.title(),'h1',page.locator('h1').inner_text(),'days',page.locator('.date-stop').count(),'events',page.locator('[data-week-event], [data-timeline-event]').count())
  page.screenshot(path=str(OUT/f'{dev}-planning.png'),full_page=True)
  if dev=='desktop':
   page.get_by_role('button',name='單日時間軸').click()
   page.wait_for_selector('.timeline-card')
   page.screenshot(path=str(OUT/'desktop-timeline.png'),full_page=True)
  page.get_by_role('button',name='費用總覽').click()
  page.wait_for_selector('#expensespage')
  page.screenshot(path=str(OUT/f'{dev}-expenses.png'),full_page=True)
  page.get_by_role('button',name='攜帶用品').click()
  page.wait_for_selector('#packingpage')
  page.screenshot(path=str(OUT/f'{dev}-packing.png'),full_page=True)
  page.get_by_role('button',name='行程規劃').click()
  page.get_by_role('button',name='新增行程',exact=True).first.click()
  page.wait_for_selector('#eventForm')
  page.screenshot(path=str(OUT/f'{dev}-form.png'),full_page=True)
  print(dev,'console errors',errors)
  context.close()
 browser.close()
