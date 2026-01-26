import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import { searchSchema, SearchFormData } from '../../utils/validators';
import { InputField } from './InputField';
import { Button } from '../common/Button';

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => Promise<void>;
  isSearching?: boolean;
  defaultValue?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  isSearching,
  defaultValue = '',
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      life_certificate_no: defaultValue,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <InputField
            {...register('life_certificate_no')}
            placeholder={t('checkStatus.placeholder')}
            error={errors.life_certificate_no?.message}
            leftIcon={<FiSearch className="w-5 h-5" />}
            aria-label={t('checkStatus.placeholder')}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSearching}
          disabled={isSearching}
          className="sm:self-start"
        >
          {isSearching ? t('checkStatus.searching') : t('checkStatus.search')}
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
