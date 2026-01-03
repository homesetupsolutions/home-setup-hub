import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Search, User, Mail, Phone, PhoneCall, ChevronDown, Users } from 'lucide-react';
import { listCustomers, searchCustomers, SquareCustomer } from '@/lib/squareCRM';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { use3CX } from '@/hooks/use3CX';

const MAX_CUSTOMERS = 2000;

export function CustomersTab() {
  const [customers, setCustomers] = useState<SquareCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const { toast } = useToast();
  const { initiateCall } = use3CX();

  const handleClickToCall = (customer: SquareCustomer) => {
    if (!customer.phone_number) return;
    const customerName = `${customer.given_name || ''} ${customer.family_name || ''}`.trim() || 'Unknown';
    initiateCall(customer.phone_number, customer.id, customerName);
  };

  // Fetch customers up to MAX_CUSTOMERS limit
  const fetchAllCustomers = useCallback(async () => {
    setLoading(true);
    setCustomers([]);
    setCursor(undefined);
    setTotalLoaded(0);
    
    try {
      let allCustomers: SquareCustomer[] = [];
      let nextCursor: string | undefined = undefined;
      
      // Keep fetching until no more pages or max reached
      do {
        const result = await listCustomers(100, nextCursor);
        allCustomers = [...allCustomers, ...result.customers];
        nextCursor = result.cursor;
        setTotalLoaded(allCustomers.length);
        
        // Stop if we've reached the max
        if (allCustomers.length >= MAX_CUSTOMERS) {
          allCustomers = allCustomers.slice(0, MAX_CUSTOMERS);
          break;
        }
      } while (nextCursor);
      
      setCustomers(allCustomers);
      setHasMore(false);
      setCursor(undefined);
      
      toast({
        title: 'Customers Loaded',
        description: `Loaded ${allCustomers.length} customers (max ${MAX_CUSTOMERS})`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial load - fetch first page quickly, then load all
  const fetchCustomers = useCallback(async (loadAll = false) => {
    if (loadAll) {
      return fetchAllCustomers();
    }
    
    setLoading(true);
    try {
      const result = await listCustomers(100);
      setCustomers(result.customers);
      setCursor(result.cursor);
      setHasMore(!!result.cursor);
      setTotalLoaded(result.customers.length);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast, fetchAllCustomers]);

  // Load more customers
  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const result = await listCustomers(100, cursor);
      setCustomers(prev => [...prev, ...result.customers]);
      setCursor(result.cursor);
      setHasMore(!!result.cursor);
      setTotalLoaded(prev => prev + result.customers.length);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load more customers',
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCustomers();
      return;
    }

    setSearching(true);
    try {
      const result = await searchCustomers(searchQuery);
      setCustomers(result.customers);
    } catch (error) {
      toast({
        title: 'Search Error',
        description: error instanceof Error ? error.message : 'Search failed',
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customers
              {totalLoaded > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalLoaded} loaded
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Complete list of all Square customers
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchCustomers(false)} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="default" size="sm" onClick={() => fetchCustomers(true)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Users className="h-4 w-4 mr-2" />}
              Load All
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span>
                          {customer.given_name || customer.family_name
                            ? `${customer.given_name || ''} ${customer.family_name || ''}`.trim()
                            : 'Unknown'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.email_address ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {customer.email_address}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer.phone_number ? (
                        <button
                          onClick={() => handleClickToCall(customer)}
                          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors group"
                          title="Click to call"
                        >
                          <PhoneCall className="h-3 w-3 group-hover:animate-pulse" />
                          {customer.phone_number}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.created_at
                        ? format(new Date(customer.created_at), 'MMM d, yyyy')
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center py-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="gap-2"
                >
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Load More Customers
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
