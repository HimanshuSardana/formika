### Sample .env file
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_PASSWORD=
```

### Usage
```bash
npm i
npm run dev
```

### TODOs

**DAY 1**
- [x] Change branding
- [x] Form creation (using gemini)
- [x] Actual form creation (saving in db)

**DAY 2**
- [ ] Make it responsive
- [ ] Form Editing
- [-] Add radio buttons and sliders to generated forms ( and type = numbers )
- [ ] Form results page
- [ ] Form insights
- [x] Form preview

**DAY 3**
- [ ] Record demo video
- [ ] Write an engineering report
- [ ] Fix bugs (if any)

### Known Bugs
- User gets randomly logged out sometimes on the /forms page (useEffect misfiring)
- Drawer on view responses page cannot be closed
