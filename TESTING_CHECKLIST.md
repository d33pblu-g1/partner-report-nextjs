# Database Edit & Delete Feature - Testing Checklist

## Pre-Testing Setup

### Step 1: Implement Backend Endpoints
Follow the instructions in `PHP_EDIT_DELETE_ENDPOINTS.md` to add the endpoints to your PHP API.

**Required endpoints:**
- [ ] `update_record` - Updates a record
- [ ] `delete_record` - Deletes a record
- [ ] `table_info` (optional) - Gets primary key info

### Step 2: Configure Table Whitelist
In your PHP API, add your tables to the `$allowedTables` array:

```php
$allowedTables = [
    'partners', 
    'clients', 
    'commissions', 
    'transactions', 
    'partner_links', 
    'partner_insights', 
    'partner_recommendations', 
    'affiliate_tips',
    // Add more tables as needed
];
```

### Step 3: Verify Backend with Curl
Test the endpoints before testing the frontend:

```bash
# Test update (use a real record from your database)
curl -X POST 'http://localhost:8001/api/index.php?endpoint=update_record&table=partners&primary_key=partner_id&primary_value=P-0001' \
  -H 'Content-Type: application/json' \
  -d '{"name": "Test Update"}'

# Test delete (use a test record you can delete)
curl -X POST 'http://localhost:8001/api/index.php?endpoint=delete_record&table=partners&primary_key=partner_id&primary_value=TEST-001'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "Record updated successfully",
    "rows_affected": 1
  }
}
```

---

## Frontend Testing Checklist

### A. Visual Elements
Navigate to `/database` page and verify:

- [ ] Database page loads without errors
- [ ] Tables list displays correctly
- [ ] Click on a table opens the modal
- [ ] Table data displays in modal
- [ ] **NEW:** "Actions" column appears in table header
- [ ] **NEW:** Edit button (✏️) appears for each row
- [ ] **NEW:** Delete button (🗑️) appears for each row
- [ ] Both buttons have hover effects

### B. Edit Functionality

#### B1. Opening Edit Modal
- [ ] Click edit button on any row
- [ ] Edit modal opens smoothly
- [ ] Modal shows "Edit Record" title
- [ ] Table name displays correctly
- [ ] All fields are pre-populated with current values
- [ ] Primary key field is disabled (grayed out)
- [ ] Primary key field shows "(Primary Key)" label
- [ ] Modal is scrollable if many fields

#### B2. Editing Fields
- [ ] Can type in non-primary key fields
- [ ] Cannot type in primary key field
- [ ] Form updates in real-time
- [ ] All field values display correctly

#### B3. Submitting Changes
- [ ] Click "Update Record" button
- [ ] Button shows "Updating..." loading state
- [ ] Button is disabled during submission
- [ ] Success notification appears (green, bottom-right)
- [ ] Notification shows: "Record updated successfully!"
- [ ] Modal closes automatically
- [ ] Table data refreshes with new values
- [ ] Notification auto-dismisses after 5 seconds

#### B4. Canceling Edit
- [ ] Click "Cancel" button
- [ ] Modal closes without saving
- [ ] No notification appears
- [ ] Table data unchanged

#### B5. Edit Error Handling
Stop your PHP API and test:
- [ ] Click edit and submit
- [ ] Error notification appears (red, bottom-right)
- [ ] Error message shows: "Network error: Could not update record"
- [ ] Modal remains open
- [ ] Can close modal and try again
- [ ] Start PHP API and retry - should work

### C. Delete Functionality

#### C1. Opening Delete Modal
- [ ] Click delete button on any row
- [ ] Delete confirmation modal opens
- [ ] Warning icon (⚠️) displays
- [ ] "Delete Record" title shows
- [ ] "This action cannot be undone" warning visible
- [ ] First 3 fields of record display
- [ ] If more than 3 fields, shows "... and X more fields"
- [ ] Table name displays correctly

#### C2. Confirming Delete
- [ ] Click "Delete Record" button (red)
- [ ] Button shows "Deleting..." loading state
- [ ] Button is disabled during deletion
- [ ] Success notification appears (green)
- [ ] Notification shows: "Record deleted successfully!"
- [ ] Modal closes automatically
- [ ] Table data refreshes (row removed)
- [ ] Notification auto-dismisses after 5 seconds

#### C3. Canceling Delete
- [ ] Click delete button
- [ ] In confirmation, click "Cancel"
- [ ] Modal closes without deleting
- [ ] No notification appears
- [ ] Record still exists in table

#### C4. Delete Error Handling
Stop your PHP API and test:
- [ ] Click delete and confirm
- [ ] Error notification appears (red)
- [ ] Error message shows: "Network error: Could not delete record"
- [ ] Modal remains open
- [ ] Can close and try again
- [ ] Start PHP API and retry - should work

### D. Notification System

#### D1. Visual Appearance
Test both success and error notifications:
- [ ] Notification appears in bottom-right corner
- [ ] Success notification is green with ✅ icon
- [ ] Error notification is red with ❌ icon
- [ ] Message text is clear and readable
- [ ] Close button (✕) is visible

#### D2. Notification Behavior
- [ ] Notification slides up smoothly (animation)
- [ ] Notification auto-dismisses after 5 seconds
- [ ] Can manually close with ✕ button
- [ ] Multiple notifications stack (try quick actions)
- [ ] Previous notification dismisses when new one appears

#### D3. Dark Mode Notifications
Toggle dark mode and verify:
- [ ] Success notification readable in dark mode
- [ ] Error notification readable in dark mode
- [ ] Icons display correctly
- [ ] Close button visible and functional

### E. Modal Interactions

#### E1. Edit Modal
- [ ] Click outside modal to close
- [ ] Modal closes and form data resets
- [ ] Click X button to close
- [ ] ESC key works (if implemented)
- [ ] Cannot interact with background while modal open

#### E2. Delete Modal
- [ ] Click outside modal to close
- [ ] Modal closes without deleting
- [ ] Click X button to close
- [ ] ESC key works (if implemented)
- [ ] Cannot interact with background while modal open

### F. Primary Key Detection

Test with different table types:

#### F1. Table with 'id' column
- [ ] Edit a record from a table with 'id' column
- [ ] Verify 'id' field is disabled
- [ ] Shows "(Primary Key)" label

#### F2. Table with custom primary key (e.g., 'partner_id')
- [ ] Edit a record from partners table
- [ ] Verify 'partner_id' field is disabled
- [ ] Shows "(Primary Key)" label

#### F3. Table with first column as key
- [ ] Edit a record from a table without 'id' or '*_id'
- [ ] Verify first column is disabled
- [ ] Shows "(Primary Key)" label

### G. Dark Mode Support

Toggle between light and dark mode:

#### G1. Light Mode
- [ ] Edit modal displays correctly
- [ ] Delete modal displays correctly
- [ ] Buttons have proper colors
- [ ] Text is readable
- [ ] Notifications display correctly
- [ ] Action buttons visible

#### G2. Dark Mode
- [ ] Edit modal background is dark
- [ ] Delete modal background is dark
- [ ] Input fields are styled for dark
- [ ] All text is readable
- [ ] Notifications have dark styling
- [ ] Action buttons visible and styled

### H. Responsive Design

Test on different screen sizes:

#### H1. Desktop (1920x1080)
- [ ] Modals are properly sized
- [ ] Not too wide or narrow
- [ ] Action buttons visible in table

#### H2. Tablet (768x1024)
- [ ] Modals adjust to screen width
- [ ] Table is scrollable horizontally
- [ ] Action buttons still accessible
- [ ] Notifications positioned correctly

#### H3. Mobile (375x667)
- [ ] Modals take most of screen width
- [ ] Form fields are large enough to tap
- [ ] Buttons are touch-friendly
- [ ] Table scrolls horizontally
- [ ] Action buttons accessible

### I. Edge Cases

#### I1. Empty Table
- [ ] Open a table with no records
- [ ] Verify no error occurs
- [ ] "This table is empty" message shows
- [ ] No action buttons to click

#### I2. Large Records
- [ ] Edit a record with many columns
- [ ] Modal is scrollable
- [ ] All fields are accessible
- [ ] Form submission works

#### I3. Long Text Values
- [ ] Edit a record with long text fields
- [ ] Input displays full text
- [ ] Can edit and submit
- [ ] Truncated values in table still display correctly

#### I4. Special Characters
- [ ] Edit a record with special characters (quotes, apostrophes)
- [ ] Characters display correctly in form
- [ ] Can save without errors
- [ ] Values saved correctly

#### I5. Null Values
- [ ] Edit a record with null values
- [ ] Null fields show as empty in form
- [ ] Can modify null fields
- [ ] Can save with null values

### J. Performance

#### J1. Loading States
- [ ] Edit/delete buttons don't lag when clicked
- [ ] Modals open instantly
- [ ] Form typing is responsive
- [ ] No noticeable delay in interactions

#### J2. API Response Times
- [ ] Update completes in < 2 seconds
- [ ] Delete completes in < 2 seconds
- [ ] Loading indicators show during wait
- [ ] No UI freezing during operations

---

## Bug Reporting Template

If you find any issues, report them using this format:

**Bug Title:** [Short description]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happened

**Environment:**
- Browser: [Chrome/Firefox/Safari/etc.]
- OS: [Windows/Mac/Linux]
- Screen Size: [Desktop/Tablet/Mobile]
- Dark Mode: [On/Off]

**Screenshots/Console Errors:**
[Attach if available]

---

## Success Criteria

Feature is complete when:
- ✅ All backend endpoints implemented and tested
- ✅ All frontend features working
- ✅ All visual tests pass
- ✅ All functional tests pass
- ✅ Both dark and light modes work
- ✅ Responsive on all screen sizes
- ✅ No console errors
- ✅ No linter errors
- ✅ All edge cases handled gracefully

---

## Quick Test (5 Minutes)

For a quick verification:

1. [ ] Backend: Run curl test for update and delete
2. [ ] Frontend: Navigate to `/database`
3. [ ] Open any table modal
4. [ ] Click edit, modify a field, save
5. [ ] Verify success notification
6. [ ] Verify data updated
7. [ ] Click delete, confirm
8. [ ] Verify success notification
9. [ ] Verify row removed
10. [ ] Test in dark mode

If all 10 steps work, the feature is functioning correctly! 🎉

