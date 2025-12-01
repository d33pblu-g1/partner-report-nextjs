# PHP Edit & Delete Endpoints Implementation Guide

## Overview
This guide provides the complete code for implementing UPDATE and DELETE endpoints in your PHP API (`/api/index.php`).

## Backend Endpoints to Add

### 1. Update Record Endpoint

Add this case to your switch statement in `/api/index.php`:

```php
case 'update_record':
    // Get parameters
    $table = $_GET['table'] ?? null;
    $primaryKey = $_GET['primary_key'] ?? null;
    $primaryValue = $_GET['primary_value'] ?? null;
    
    if (!$table || !$primaryKey || !$primaryValue) {
        sendError('Missing required parameters: table, primary_key, primary_value');
        break;
    }
    
    // Get JSON data from request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data || !is_array($data)) {
        sendError('Invalid or missing data');
        break;
    }
    
    try {
        // Sanitize table name (prevent SQL injection)
        $allowedTables = [
            'partners', 'clients', 'commissions', 'transactions', 
            'partner_links', 'partner_insights', 'partner_recommendations', 
            'affiliate_tips', 'badges', 'tiers', 'commission_plans'
        ];
        
        if (!in_array($table, $allowedTables)) {
            sendError('Invalid table name');
            break;
        }
        
        // Build UPDATE query dynamically
        $setClauses = [];
        $params = [];
        
        foreach ($data as $column => $value) {
            // Skip the primary key in the SET clause
            if ($column !== $primaryKey) {
                $setClauses[] = "`$column` = ?";
                $params[] = $value;
            }
        }
        
        if (empty($setClauses)) {
            sendError('No fields to update');
            break;
        }
        
        // Add the primary key value for the WHERE clause
        $params[] = $primaryValue;
        
        $sql = "UPDATE `$table` SET " . implode(', ', $setClauses) . " WHERE `$primaryKey` = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess(['message' => 'Record updated successfully', 'rows_affected' => $stmt->rowCount()]);
        } else {
            sendError('No record found or no changes made');
        }
    } catch (PDOException $e) {
        sendError('Database error: ' . $e->getMessage());
    }
    break;
```

### 2. Delete Record Endpoint

Add this case to your switch statement in `/api/index.php`:

```php
case 'delete_record':
    // Get parameters
    $table = $_GET['table'] ?? null;
    $primaryKey = $_GET['primary_key'] ?? null;
    $primaryValue = $_GET['primary_value'] ?? null;
    
    if (!$table || !$primaryKey || !$primaryValue) {
        sendError('Missing required parameters: table, primary_key, primary_value');
        break;
    }
    
    try {
        // Sanitize table name (prevent SQL injection)
        $allowedTables = [
            'partners', 'clients', 'commissions', 'transactions', 
            'partner_links', 'partner_insights', 'partner_recommendations', 
            'affiliate_tips', 'badges', 'tiers', 'commission_plans'
        ];
        
        if (!in_array($table, $allowedTables)) {
            sendError('Invalid table name');
            break;
        }
        
        // Delete the record
        $sql = "DELETE FROM `$table` WHERE `$primaryKey` = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$primaryValue]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess(['message' => 'Record deleted successfully', 'rows_affected' => $stmt->rowCount()]);
        } else {
            sendError('No record found');
        }
    } catch (PDOException $e) {
        sendError('Database error: ' . $e->getMessage());
    }
    break;
```

### 3. Get Primary Key Info Endpoint (Helper)

This optional endpoint helps detect the primary key for a table:

```php
case 'table_info':
    $table = $_GET['table'] ?? null;
    
    if (!$table) {
        sendError('Missing required parameter: table');
        break;
    }
    
    try {
        // Get table structure including primary key
        $sql = "SHOW KEYS FROM `$table` WHERE Key_name = 'PRIMARY'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $primaryKeyInfo = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($primaryKeyInfo) {
            sendSuccess([
                'table' => $table,
                'primary_key' => $primaryKeyInfo['Column_name']
            ]);
        } else {
            sendError('No primary key found for this table');
        }
    } catch (PDOException $e) {
        sendError('Database error: ' . $e->getMessage());
    }
    break;
```

## Testing the Endpoints

### Test Update Record

```bash
# Update a partner record
curl -X POST 'http://localhost:8001/api/index.php?endpoint=update_record&table=partners&primary_key=partner_id&primary_value=P-0001' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Updated Partner Name",
    "email": "newemail@example.com"
  }'
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

### Test Delete Record

```bash
# Delete a record
curl -X POST 'http://localhost:8001/api/index.php?endpoint=delete_record&table=partners&primary_key=partner_id&primary_value=P-9999' \
  -H 'Content-Type: application/json'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "Record deleted successfully",
    "rows_affected": 1
  }
}
```

### Test Table Info (Primary Key Detection)

```bash
curl 'http://localhost:8001/api/index.php?endpoint=table_info&table=partners'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "table": "partners",
    "primary_key": "partner_id"
  }
}
```

## Security Considerations

1. **Whitelist Tables**: The `$allowedTables` array prevents SQL injection by only allowing specific tables.
2. **Prepared Statements**: All queries use prepared statements with parameter binding.
3. **Input Validation**: Parameters are validated before use.
4. **Authorization**: Consider adding authentication/authorization checks before allowing updates/deletes.

## Add More Tables to Whitelist

If you have additional tables that need edit/delete functionality, add them to the `$allowedTables` array:

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
    'badges', 
    'tiers', 
    'commission_plans',
    // Add your custom tables here
    'your_custom_table_name',
];
```

## Error Handling

The endpoints return standardized error responses:
- Missing parameters: 400-level error
- Invalid table name: Security error
- Database errors: PDO exception message
- No rows affected: Informational error

## Complete Example Integration

Here's how your `/api/index.php` switch statement should look with the new endpoints:

```php
<?php
// ... existing headers and database connection code ...

$endpoint = $_GET['endpoint'] ?? '';

switch ($endpoint) {
    case 'partners':
        // existing code
        break;
    
    case 'update_record':
        // [INSERT UPDATE CODE FROM ABOVE]
        break;
    
    case 'delete_record':
        // [INSERT DELETE CODE FROM ABOVE]
        break;
    
    case 'table_info':
        // [INSERT TABLE INFO CODE FROM ABOVE]
        break;
    
    // ... other existing endpoints ...
    
    default:
        sendError('Endpoint not found');
        break;
}
?>
```

## Next Steps

After implementing these endpoints:
1. Test each endpoint using the curl commands provided
2. Verify the frontend Database page can successfully edit and delete records
3. Add any additional tables to the whitelist as needed
4. Consider adding authentication/authorization if needed

## Troubleshooting

### "Invalid table name"
- Add your table to the `$allowedTables` array

### "No record found"
- Verify the primary key and primary value are correct
- Check that the record exists in the database

### "Database error"
- Check database connection settings
- Verify table and column names exist
- Check SQL syntax in error message

### CORS Issues
- Ensure proper CORS headers are set in your PHP API
- Add these headers at the top of index.php if needed:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

