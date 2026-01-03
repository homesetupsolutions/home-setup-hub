import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Search, User, Mail, PhoneCall, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { listCustomers, searchCustomers, SquareCustomer } from '@/lib/squareCRM';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { use3CX } from '@/hooks/use3CX';

const PAGE_SIZE = 100;

export function CustomersTab() {
  const [customers, setCustomers] = useState<SquareCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();
  const { initiateCall } = use3CX();

  const handleClickToCall = (customer: SquareCustomer) => {
    if (!customer.phone_number) return;
    const customerName = `${customer.given_name || ''} ${customer.family_name || ''}`.trim() || 'Unknown';
    initiateCall(customer.phone_number, customer.id, customerName);
  };

  // Fetch first page of customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setCustomers([]);
    setCursor(undefined);
    
    try {
      const result = await listCustomers(PAGE_SIZE);
      setCustomers(result.customers);
      setCursor(result.cursor);
      setHasMore(!!result.cursor);
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

  // Load next page of customers
  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const result = await listCustomers(PAGE_SIZE, cursor);
      setCustomers(prev => [...prev, ...result.customers]);
      setCursor(result.cursor);
      setHasMore(!!result.cursor);
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
    setCursor(undefined);
    setHasMore(false);
    
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

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              {customers.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {customers.length} shown
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Browse Square CRM customers (paginated)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchCustomers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
            
            {/* Pagination Controls */}
            <div className="flex justify-between items-center py-4 border-t">
              {customers.length > PAGE_SIZE && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={scrollToTop}
                  className="gap-2"
                >
                  <ChevronUp className="h-4 w-4" />
                  Back to Top
                </Button>
              )}
              
              {hasMore ? (
                <Button 
                  variant="outline" 
                  onClick={loadMore} 
                  disabled={loadingMore}
                  className="gap-2 ml-auto"
                >
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Load More ({PAGE_SIZE})
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground ml-auto">
                  End of list
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
